<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\UserAlert;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $alerts = UserAlert::where('user_id', auth()->id())
            ->orWhereNull('user_id')
            ->latest()
            ->paginate(20);
        return response()->json(['status' => 'success', 'data' => $alerts]);
    }

    public function markAsRead(UserAlert $notification)
    {
        $notification->update(['is_read' => true, 'read_at' => now()]);
        return response()->json(['status' => 'success', 'data' => $notification]);
    }

    public function markAllAsRead()
    {
        UserAlert::where('user_id', auth()->id())
            ->orWhereNull('user_id')
            ->update(['is_read' => true, 'read_at' => now()]);
        return response()->json(['status' => 'success', 'message' => 'All notifications marked as read']);
    }

    public function unreadCount()
    {
        $count = UserAlert::where(function ($q) {
            $q->where('user_id', auth()->id())->orWhereNull('user_id');
        })->where('is_read', false)->count();
        return response()->json(['status' => 'success', 'data' => ['count' => $count]]);
    }
}
