<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => 'success',
            'data' => Setting::all()->groupBy('group')
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable|string',
            'settings.*.group' => 'nullable|string',
        ]);

        foreach ($validated['settings'] as $setting) {
            Setting::setValue(
                $setting['key'],
                $setting['value'] ?? '',
                $setting['group'] ?? 'general'
            );
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Settings updated',
            'data' => Setting::all()->groupBy('group')
        ]);
    }
}
