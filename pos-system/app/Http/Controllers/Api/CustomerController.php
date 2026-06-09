<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $customers = Customer::query();
        if ($request->has('search')) {
            $search = $request->input('search');
            $customers->where('name', 'like', "%$search%")
                ->orWhere('email', 'like', "%$search%")
                ->orWhere('phone', 'like', "%$search%");
        }
        return response()->json([
            'status' => 'success',
            'data' => $customers->latest()->paginate($request->per_page ?? 10)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);
        $customer = Customer::create($validated);
        return response()->json(['status' => 'success', 'message' => 'Customer created', 'data' => $customer], 201);
    }

    public function show(Customer $customer)
    {
        return response()->json(['status' => 'success', 'data' => $customer->load('transactions')]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'notes' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);
        $customer->update($validated);
        return response()->json(['status' => 'success', 'message' => 'Customer updated', 'data' => $customer]);
    }

    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response()->json(['status' => 'success', 'message' => 'Customer deleted']);
    }
}
