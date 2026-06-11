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
        $now = now();

        // ── Base query: sale transactions only (not cancelled) ──
        $todaySaleQuery = Transaction::whereDate('created_at', $today)
            ->where('type', 'sale')
            ->where('status', '!=', 'cancelled');

        // Hourly sales: 24-element array (index = hour, value = total)
        $hourlyRaw = (clone $todaySaleQuery)
            ->selectRaw('HOUR(created_at) as hour, SUM(total) as total')
            ->groupBy('hour')
            ->pluck('total', 'hour')
            ->toArray();

        $hourlySales = array_fill(0, 24, 0);
        foreach ($hourlyRaw as $hour => $total) {
            $hourlySales[(int)$hour] = (int)$total;
        }

        // ── Weekly sales (Mon–Sun, 7 slots) ──
        $weekStart = (clone $now)->startOfWeek(); // Monday 00:00
        $weekEnd = (clone $weekStart)->addDays(6)->endOfDay(); // Sunday 23:59

        $weeklyRaw = Transaction::whereBetween('created_at', [$weekStart, $weekEnd])
            ->where('type', 'sale')
            ->where('status', '!=', 'cancelled')
            ->selectRaw('DAYOFWEEK(created_at) as day_of_week, SUM(total) as total')
            ->groupBy('day_of_week')
            ->pluck('total', 'day_of_week')
            ->toArray();

        $weeklySales = array_fill(0, 7, 0);
        // MySQL DAYOFWEEK: 1=Sun,2=Mon,...,7=Sat
        // We want index 0=Mon,1=Tue,...,6=Sun
        foreach ($weeklyRaw as $dayOfWeek => $total) {
            $index = ((int)$dayOfWeek + 5) % 7; // 2->0, 3->1, ..., 1->6 (Sun)
            $weeklySales[$index] = (int)$total;
        }

        // ── Monthly sales (by day of month) ──
        $monthStart = (clone $now)->copy()->startOfMonth();
        $monthEnd = (clone $now)->copy()->endOfMonth();
        $daysInMonth = (clone $now)->copy()->daysInMonth;

        $monthlyRaw = Transaction::whereBetween('created_at', [$monthStart, $monthEnd])
            ->where('type', 'sale')
            ->where('status', '!=', 'cancelled')
            ->selectRaw('DAY(created_at) as day, SUM(total) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->toArray();

        $monthlySales = array_fill(0, $daysInMonth, 0);
        foreach ($monthlyRaw as $day => $total) {
            $monthlySales[(int)$day - 1] = (int)$total;
        }

        $stats = [
            'today_sales' => (clone $todaySaleQuery)->sum('total'),
            'today_transactions' => (clone $todaySaleQuery)->count(),
            'today_items_sold' => TransactionItem::whereHas('transaction', function($query) use ($today){
                $query->whereDate('created_at', $today)
                    ->where('type', 'sale')
                    ->where('status', '!=', 'cancelled');
            })->sum('quantity'),
            'low_stock_products' => Product::whereColumn('stock', '<=', 'min_stock')->count(),
            'total_products' => Product::count(),
            'hourly_sales' => $hourlySales,
            'weekly_sales' => $weeklySales,
            'monthly_sales' => $monthlySales,
        ];

        // Recent transactions: only today's sales (not cancelled), newest first
        $recentTransactions = Transaction::with('user')
            ->whereDate('created_at', $today)
            ->where('type', 'sale')
            ->latest()
            ->limit(5)
            ->get();

        $topProducts = TransactionItem::select('product_id', DB::raw('SUM(quantity) as total_sold'))
            ->groupBy('product_id')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->with('product')
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
