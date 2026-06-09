<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    public function index(Request $request)
    {
        $discounts = Discount::query();
        if ($request->has('search')) {
            $discounts->where('name', 'like', "%{$request->search}%")->orWhere('code', 'like', "%{$request->search}%");
        }
        return response()->json(['status' => 'success', 'data' => $discounts->latest()->paginate($request->per_page ?? 10)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:discounts,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'description' => 'nullable|string',
        ]);
        return response()->json(['status' => 'success', 'data' => Discount::create($validated)], 201);
    }

    public function show(Discount $discount)
    {
        return response()->json(['status' => 'success', 'data' => $discount]);
    }

    public function update(Request $request, Discount $discount)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:50|unique:discounts,code,' . $discount->id,
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'min_purchase' => 'nullable|numeric|min:0',
            'max_uses' => 'nullable|integer|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_active' => 'sometimes|boolean',
            'description' => 'nullable|string',
        ]);
        $discount->update($validated);
        return response()->json(['status' => 'success', 'data' => $discount]);
    }

    public function destroy(Discount $discount)
    {
        $discount->delete();
        return response()->json(['status' => 'success', 'message' => 'Discount deleted']);
    }
}
