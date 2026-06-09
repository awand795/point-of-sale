<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::with('roles');
        if ($request->has('search')) {
            $search = $request->input('search');
            $users->where('name', 'like', "%$search%")->orWhere('email', 'like', "%$search%");
        }
        return response()->json([
            'status' => 'success',
            'data' => $users->latest()->paginate($request->per_page ?? 10)
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);

        if (!empty($validated['role'])) {
            $user->assignRole($validated['role']);
        } else {
            $user->assignRole('cashier');
        }

        return response()->json(['status' => 'success', 'data' => $user->load('roles')], 201);
    }

    public function show(User $user)
    {
        return response()->json(['status' => 'success', 'data' => $user->load('roles')]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:20',
            'is_active' => 'sometimes|boolean',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);

        if (!empty($validated['role'])) {
            $user->syncRoles([$validated['role']]);
        }

        return response()->json(['status' => 'success', 'data' => $user->load('roles')]);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'User deleted']);
    }

    public function roles()
    {
        return response()->json(['status' => 'success', 'data' => Role::all()]);
    }
}
