<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(['status' => 'success', 'data' => Store::latest()->paginate($request->per_page ?? 10)]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:stores,code',
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
        ]);
        return response()->json(['status' => 'success', 'data' => Store::create($validated)], 201);
    }

    public function show(Store $store)
    {
        return response()->json(['status' => 'success', 'data' => $store->load(['users', 'products'])]);
    }

    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:20|unique:stores,code,' . $store->id,
            'address' => 'nullable|string',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email',
            'is_active' => 'sometimes|boolean',
        ]);
        $store->update($validated);
        return response()->json(['status' => 'success', 'data' => $store]);
    }

    public function destroy(Store $store)
    {
        $store->delete();
        return response()->json(['status' => 'success', 'message' => 'Store deleted']);
    }
}
