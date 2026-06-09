<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $purchases = Purchase::with(['supplier', 'user', 'items.product']);
        if ($request->has('status')) {
            $purchases->where('status', $request->status);
        }
        return response()->json([
            'status' => 'success',
            'data' => $purchases->latest()->paginate($request->per_page ?? 10)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'supplier_id' => 'nullable|exists:suppliers,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.purchase_price' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['purchase_price'] * $item['quantity'];
            }
            $total = $subtotal - ($validated['discount'] ?? 0) + ($validated['tax'] ?? 0);

            $purchase = Purchase::create([
                'invoice_number' => 'PO-' . strtoupper(Str::random(8)),
                'supplier_id' => $validated['supplier_id'] ?? null,
                'user_id' => auth()->id(),
                'status' => 'pending',
                'subtotal' => $subtotal,
                'discount' => $validated['discount'] ?? 0,
                'tax' => $validated['tax'] ?? 0,
                'total' => $total,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['items'] as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'subtotal' => $item['purchase_price'] * $item['quantity'],
                ]);
            }

            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Purchase created', 'data' => $purchase->load('items.product', 'supplier')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function receive(Purchase $purchase)
    {
        try {
            DB::beginTransaction();
            foreach ($purchase->items as $item) {
                $product = Product::findOrFail($item->product_id);
                $product->increment('stock', $item->quantity);
                $product->update(['purchase_price' => $item->purchase_price]);
            }
            $purchase->update(['status' => 'received', 'received_at' => now()]);
            DB::commit();
            return response()->json(['status' => 'success', 'message' => 'Purchase received']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Purchase $purchase)
    {
        return response()->json(['status' => 'success', 'data' => $purchase->load('items.product', 'supplier', 'user')]);
    }
}
