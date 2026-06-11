<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'items.product']);

        if($request->has('date')){
            $query->whereDate('created_at', $request->input('date'));  
        }

        if($request->has('type')){
            $query->where('type', $request->input('type'));  
        }

        if($request->has('status')){
            $query->where('status', $request->input('status'));  
        }

        $transactions = $query->latest()->paginate($request->per_page ?? 10);

        return response()->json([
            'status' => 'success',
            'data' => $transactions
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|max:50',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'type' => 'sale',
                'status' => 'paid',
                'subtotal' => 0,
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'total' => 0,
                'paid_amount' => $validated['paid_amount'],
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
                'completed_at' => now(),
            ]);

            $subtotal = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $lineSubtotal = $product->selling_price * $item['quantity'];
                $subtotal += $lineSubtotal;

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'purchase_price' => $product->purchase_price,
                    'selling_price' => $product->selling_price,
                    'subtotal' => $lineSubtotal,
                ]);

                // Update product stock
                $product->decrement('stock', $item['quantity']);
            }

            $total = $subtotal - ($validated['discount'] ?? 0) + ($validated['tax'] ?? 0);

            // Update transaction with calculated totals
            $transaction->update([
                'subtotal' => $subtotal,
                'total' => $total,
            ]);

            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Transaction created successfully',
                'data' => $transaction->load('items.product')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create transaction: '.$e->getMessage()
            ], 500);
        }
    }

    public function dashboard(){
        $today = now()->toDateString();
        $yesterday = now()->subDay()->toDateString();
        $now = now();

        // ── Base query: sale transactions only (not cancelled) ──
        $baseSaleQuery = Transaction::where('type', 'sale')
            ->where('status', '!=', 'cancelled');

        $todaySaleQuery = (clone $baseSaleQuery)->whereDate('created_at', $today);
        $yesterdaySaleQuery = (clone $baseSaleQuery)->whereDate('created_at', $yesterday);

        // Hourly sales: 24-element array
        $hourlyRaw = (clone $todaySaleQuery)
            ->selectRaw('HOUR(created_at) as hour, SUM(total) as total')
            ->groupBy('hour')
            ->pluck('total', 'hour')
            ->toArray();

        $hourlySales = array_fill(0, 24, 0);
        foreach ($hourlyRaw as $hour => $total) {
            $hourlySales[(int)$hour] = (float)$total;
        }

        // ── Weekly sales (Mon–Sun, 7 slots) ──
        $weekStart = (clone $now)->startOfWeek(); // Monday 00:00
        $weekEnd = (clone $weekStart)->addDays(6)->endOfDay(); // Sunday 23:59

        $weeklyRaw = (clone $baseSaleQuery)
            ->whereBetween('created_at', [$weekStart, $weekEnd])
            ->selectRaw('DAYOFWEEK(created_at) as day_of_week, SUM(total) as total')
            ->groupBy('day_of_week')
            ->pluck('total', 'day_of_week')
            ->toArray();

        $weeklySales = array_fill(0, 7, 0);
        foreach ($weeklyRaw as $dayOfWeek => $total) {
            $index = ((int)$dayOfWeek + 5) % 7; 
            $weeklySales[$index] = (float)$total;
        }

        // ── Monthly sales (by day of month) ──
        $monthStart = (clone $now)->copy()->startOfMonth();
        $monthEnd = (clone $now)->copy()->endOfMonth();
        $daysInMonth = (clone $now)->copy()->daysInMonth;

        $monthlyRaw = (clone $baseSaleQuery)
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->selectRaw('DAY(created_at) as day, SUM(total) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $monthlySales = array_fill(0, $daysInMonth, 0);
        foreach ($monthlyRaw as $day => $total) {
            $monthlySales[(int)$day - 1] = (float)$total;
        }

        // Trend calculations
        $todayRevenue = (float)$todaySaleQuery->sum('total');
        $yesterdayRevenue = (float)$yesterdaySaleQuery->sum('total');
        $revenueTrend = $yesterdayRevenue > 0 ? round((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100, 1) : 0;

        $todayTxCount = $todaySaleQuery->count();
        $yesterdayTxCount = $yesterdaySaleQuery->count();
        $txCountTrend = $yesterdayTxCount > 0 ? round((($todayTxCount - $yesterdayTxCount) / $yesterdayTxCount) * 100, 1) : 0;

        $todayItemsCount = (int)TransactionItem::whereHas('transaction', function($q) use ($today) {
            $q->whereDate('created_at', $today)->where('type', 'sale')->where('status', '!=', 'cancelled');
        })->sum('quantity');
        $yesterdayItemsCount = (int)TransactionItem::whereHas('transaction', function($q) use ($yesterday) {
            $q->whereDate('created_at', $yesterday)->where('type', 'sale')->where('status', '!=', 'cancelled');
        })->sum('quantity');
        $itemsTrend = $yesterdayItemsCount > 0 ? round((($todayItemsCount - $yesterdayItemsCount) / $yesterdayItemsCount) * 100, 1) : 0;

        $stats = [
            'today_sales' => $todayRevenue,
            'today_sales_trend' => $revenueTrend,
            'today_transactions' => $todayTxCount,
            'today_transactions_trend' => $txCountTrend,
            'today_items_sold' => $todayItemsCount,
            'today_items_sold_trend' => $itemsTrend,
            'low_stock_products' => Product::whereColumn('stock', '<=', 'min_stock')->count(),
            'total_products' => Product::count(),
            'hourly_sales' => $hourlySales,
            'weekly_sales' => $weeklySales,
            'monthly_sales' => $monthlySales,
        ];

        // Recent transactions: last 5 sales (not just today)
        $recentTransactions = Transaction::with('user')
            ->where('type', 'sale')
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->limit(5)
            ->get();

        // Top products: only from valid sales
        $topProducts = TransactionItem::whereHas('transaction', function($query) {
                $query->where('type', 'sale')
                    ->where('status', '!=', 'cancelled');
            })
            ->select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->with('product.category')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => $stats,
                'recent_transactions' => $recentTransactions,
                'top_products' => $topProducts
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
