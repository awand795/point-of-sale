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
                'total_amount' => 0, // Will be updated later
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'paid_amount' => $validated['paid_amount'],
                'payment_method' => $validated['payment_method'],
                'notes' => $validated['notes'] ?? null,
            ]);

            $totalAmount = 0;

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);
                $lineTotal = $product->selling_price * $item['quantity'];
                $totalAmount += $lineTotal;

                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->selling_price,
                    'total' => $lineTotal,
                ]);

                // Update product stock
                $product->decrement('stock', $item['quantity']);
            }

            // Update total amount after calculating line totals
            $transaction->update(['total_amount' => $totalAmount]);

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

        $stats = [
            'today_sales' => Transaction::whereDate('created_at', $today)->where('type', 'sale')->sum('total'),
            'today_transactions' => Transaction::whereDate('created_at', $today)->where('type', 'sale')->count(),
            'today_items_sold' => TransactionItem::whereHas('transaction', function($query) use ($today){
                $query->whereDate('created_at', $today)->where('type', 'sale');
            })->sum('quantity'),
            'low_stock_products' => Product::whereColumn('stock', '<=', 'min_stock')->count(),
            'total_products' => Product::count(),
        ];

        $recentTransactions = Transaction::with('user')->latest()->limit(5)->get();

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
