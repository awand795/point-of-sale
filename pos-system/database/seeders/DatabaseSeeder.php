<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'cashier']);
        Role::create(['name' => 'manager']);

        // Users
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin1234'),
        ]);
        $admin->assignRole('admin');

        $cashier = User::factory()->create([
            'name' => 'Budi Kasir',
            'email' => 'cashier@example.com',
            'password' => bcrypt('cashier1234'),
        ]);
        $cashier->assignRole('cashier');

        // Categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Food & Beverage', 'slug' => 'food-beverage'],
            ['name' => 'Clothing', 'slug' => 'clothing'],
            ['name' => 'Home & Garden', 'slug' => 'home-garden'],
        ];
        foreach ($categories as $category) {
            Category::create($category);
        }

        // Products
        $products = [
            // Electronics
            ['category_id' => 1, 'sku' => 'ELEC-001', 'name' => 'Wireless Mouse', 'purchase_price' => 50000, 'selling_price' => 75000, 'stock' => 50, 'min_stock' => 10],
            ['category_id' => 1, 'sku' => 'ELEC-002', 'name' => 'USB Keyboard', 'purchase_price' => 100000, 'selling_price' => 150000, 'stock' => 30, 'min_stock' => 5],
            ['category_id' => 1, 'sku' => 'ELEC-003', 'name' => 'USB Hub 4 Port', 'purchase_price' => 35000, 'selling_price' => 55000, 'stock' => 40, 'min_stock' => 8],
            ['category_id' => 1, 'sku' => 'ELEC-004', 'name' => 'Headset Gaming', 'purchase_price' => 120000, 'selling_price' => 185000, 'stock' => 20, 'min_stock' => 5],
            ['category_id' => 1, 'sku' => 'ELEC-005', 'name' => 'Kabel HDMI 2m', 'purchase_price' => 25000, 'selling_price' => 45000, 'stock' => 60, 'min_stock' => 10],
            // Food & Beverage
            ['category_id' => 2, 'sku' => 'FOOD-001', 'name' => 'Mineral Water 600ml', 'purchase_price' => 2000, 'selling_price' => 3500, 'stock' => 200, 'min_stock' => 50],
            ['category_id' => 2, 'sku' => 'FOOD-002', 'name' => 'Teh Botol 450ml', 'purchase_price' => 3000, 'selling_price' => 5000, 'stock' => 150, 'min_stock' => 30],
            ['category_id' => 2, 'sku' => 'FOOD-003', 'name' => 'Kopi Kaleng', 'purchase_price' => 5000, 'selling_price' => 8000, 'stock' => 100, 'min_stock' => 20],
            ['category_id' => 2, 'sku' => 'FOOD-004', 'name' => 'Snack Keripik', 'purchase_price' => 7000, 'selling_price' => 12000, 'stock' => 80, 'min_stock' => 15],
            ['category_id' => 2, 'sku' => 'FOOD-005', 'name' => 'Mie Instan Cup', 'purchase_price' => 3500, 'selling_price' => 5500, 'stock' => 120, 'min_stock' => 25],
            // Clothing
            ['category_id' => 3, 'sku' => 'CLO-001', 'name' => 'Kaos Polos Hitam', 'purchase_price' => 35000, 'selling_price' => 65000, 'stock' => 40, 'min_stock' => 10],
            ['category_id' => 3, 'sku' => 'CLO-002', 'name' => 'Kaos Polos Putih', 'purchase_price' => 35000, 'selling_price' => 65000, 'stock' => 40, 'min_stock' => 10],
            ['category_id' => 3, 'sku' => 'CLO-003', 'name' => 'Topi Baseball', 'purchase_price' => 25000, 'selling_price' => 45000, 'stock' => 30, 'min_stock' => 5],
            // Home & Garden
            ['category_id' => 4, 'sku' => 'HOME-001', 'name' => 'Lampu LED 12W', 'purchase_price' => 15000, 'selling_price' => 28000, 'stock' => 100, 'min_stock' => 20],
            ['category_id' => 4, 'sku' => 'HOME-002', 'name' => 'Stop Kontak 3 Lubang', 'purchase_price' => 20000, 'selling_price' => 35000, 'stock' => 50, 'min_stock' => 10],
        ];

        $createdProducts = [];
        foreach ($products as $item) {
            $createdProducts[] = Product::create(array_merge($item, [
                'slug' => Str::slug($item['name']),
                'unit' => 'pcs',
            ]));
        }

        // Transactions
        $transactionsData = [
            // Transaksi 1 - Budi kasir, cash, hari ini
            [
                'user' => $cashier,
                'payment_method' => 'cash',
                'status' => 'paid',
                'items' => [
                    ['product_index' => 0, 'qty' => 2],  // Wireless Mouse x2
                    ['product_index' => 5, 'qty' => 3],  // Mineral Water x3
                ],
                'discount' => 0,
                'tax' => 0,
                'days_ago' => 0,
            ],
            // Transaksi 2 - Budi kasir, qris, hari ini
            [
                'user' => $cashier,
                'payment_method' => 'qris',
                'status' => 'paid',
                'items' => [
                    ['product_index' => 3, 'qty' => 1],  // Headset Gaming x1
                    ['product_index' => 4, 'qty' => 2],  // Kabel HDMI x2
                ],
                'discount' => 5000,
                'tax' => 0,
                'days_ago' => 0,
            ],
            // Transaksi 3 - Admin, cash, kemarin
            [
                'user' => $admin,
                'payment_method' => 'cash',
                'status' => 'paid',
                'items' => [
                    ['product_index' => 6, 'qty' => 5],  // Teh Botol x5
                    ['product_index' => 7, 'qty' => 3],  // Kopi Kaleng x3
                    ['product_index' => 8, 'qty' => 2],  // Snack Keripik x2
                ],
                'discount' => 0,
                'tax' => 0,
                'days_ago' => 1,
            ],
            // Transaksi 4 - Budi kasir, debit, 2 hari lalu
            [
                'user' => $cashier,
                'payment_method' => 'debit',
                'status' => 'paid',
                'items' => [
                    ['product_index' => 10, 'qty' => 3], // Kaos Polos Hitam x3
                    ['product_index' => 12, 'qty' => 2], // Topi Baseball x2
                ],
                'discount' => 10000,
                'tax' => 0,
                'days_ago' => 2,
            ],
            // Transaksi 5 - Budi kasir, cash, 3 hari lalu
            [
                'user' => $cashier,
                'payment_method' => 'cash',
                'status' => 'paid',
                'items' => [
                    ['product_index' => 13, 'qty' => 4], // Lampu LED x4
                    ['product_index' => 14, 'qty' => 2], // Stop Kontak x2
                    ['product_index' => 9, 'qty' => 6],  // Mie Instan Cup x6
                ],
                'discount' => 0,
                'tax' => 0,
                'days_ago' => 3,
            ],
            // Transaksi 6 - pending
            [
                'user' => $cashier,
                'payment_method' => 'cash',
                'status' => 'pending',
                'items' => [
                    ['product_index' => 1, 'qty' => 1],  // USB Keyboard x1
                    ['product_index' => 2, 'qty' => 1],  // USB Hub x1
                ],
                'discount' => 0,
                'tax' => 0,
                'days_ago' => 0,
            ],
        ];

        foreach ($transactionsData as $index => $trxData) {
            $subtotal = 0;
            $itemsToCreate = [];

            foreach ($trxData['items'] as $itemData) {
                $product = $createdProducts[$itemData['product_index']];
                $lineTotal = $product->selling_price * $itemData['qty'];
                $subtotal += $lineTotal;

                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'quantity' => $itemData['qty'],
                    'purchase_price' => $product->purchase_price,
                    'selling_price' => $product->selling_price,
                    'subtotal' => $lineTotal,
                ];
            }

            $total = $subtotal - $trxData['discount'] + $trxData['tax'];
            $paidAmount = $trxData['status'] === 'paid' ? $total : 0;
            $createdAt = now()->subDays($trxData['days_ago'])->subHours(rand(1, 8));

            $transaction = Transaction::create([
                'invoice_number' => 'INV-' . str_pad($index + 1, 6, '0', STR_PAD_LEFT),
                'user_id' => $trxData['user']->id,
                'type' => 'sale',
                'status' => $trxData['status'],
                'subtotal' => $subtotal,
                'tax' => $trxData['tax'],
                'discount' => $trxData['discount'],
                'total' => $total,
                'paid_amount' => $paidAmount,
                'payment_method' => $trxData['payment_method'],
                'completed_at' => $trxData['status'] === 'paid' ? $createdAt : null,
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            foreach ($itemsToCreate as $item) {
                TransactionItem::create(array_merge($item, [
                    'transaction_id' => $transaction->id,
                ]));
            }
        }
    }
}
