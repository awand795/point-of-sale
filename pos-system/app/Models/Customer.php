<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'email', 'phone', 'address', 'member_code',
        'loyalty_points', 'total_spent', 'birth_date', 'notes', 'is_active',
    ];

    protected $casts = [
        'loyalty_points' => 'integer',
        'total_spent' => 'decimal:2',
        'birth_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
