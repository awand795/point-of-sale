<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [PosController::class, 'dashboard'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('pos', [PosController::class, 'pos'])->name('pos');
    Route::get('products', [PosController::class, 'products'])->name('products');
    Route::get('categories', [PosController::class, 'categories'])->name('categories');
    Route::get('transactions', [PosController::class, 'transactions'])->name('transactions');
    Route::get('reports', [PosController::class, 'reports'])->name('reports');
});

require __DIR__.'/settings.php';
