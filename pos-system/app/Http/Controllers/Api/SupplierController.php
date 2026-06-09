<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier::query();
        if ($request->has('search')) {
            $search = $request->input('search');
            $suppliers->where('name', 'like', "%$search%")->orWhere('company', 'like', "%$search%");
        }
        return response()->json([
            'status' => 'success',
            'data' => $suppliers->latest()->paginate($request->per_page ?? 10)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);
        return response()->json(['status' => 'success', 'data' => Supplier::create($validated)], 201);
    }

    public function show(Supplier $supplier)
    {
        return response()->json(['status' => 'success', 'data' => $supplier->load('purchases')]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'tax_id' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);
        $supplier->update($validated);
        return response()->json(['status' => 'success', 'data' => $supplier]);
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response()->json(['status' => 'success', 'message' => 'Supplier deleted']);
    }
}
