<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Discount;
use App\Models\Store;
use App\Models\Setting;
use App\Models\UserAlert;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles - use firstOrCreate so it's safe to run multiple times
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'cashier', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);

        // Users - use firstOrCreate so it's safe to run multiple times
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin User', 'password' => bcrypt('admin1234'), 'email_verified_at' => now()]
        );
        if (!$admin->hasRole('admin')) $admin->assignRole('admin');

        $cashier = User::firstOrCreate(
            ['email' => 'cashier@example.com'],
            ['name' => 'Budi Kasir', 'password' => bcrypt('cashier1234'), 'email_verified_at' => now()]
        );
        if (!$cashier->hasRole('cashier')) $cashier->assignRole('cashier');

        // Demo user (untuk mode demo via ?demo=true)
        $demoUser = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            ['name' => 'Demo User', 'password' => bcrypt('demo1234'), 'email_verified_at' => now()]
        );
        if (!$demoUser->hasRole('admin')) $demoUser->assignRole('admin');

        // Categories
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics'],
            ['name' => 'Food & Beverage', 'slug' => 'food-beverage'],
            ['name' => 'Clothing', 'slug' => 'clothing'],
            ['name' => 'Home & Garden', 'slug' => 'home-garden'],
        ];
        foreach ($categories as $category) {
            Category::firstOrCreate(['slug' => $category['slug']], $category);
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
            $data = array_merge($item, [
                'slug' => Str::slug($item['name']),
                'unit' => 'pcs',
            ]);
            $createdProducts[] = Product::firstOrCreate(['sku' => $item['sku']], $data);
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

            $transaction = Transaction::firstOrCreate(
                ['invoice_number' => 'INV-' . str_pad($index + 1, 6, '0', STR_PAD_LEFT)],
                [
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
                ]
            );

            // Only create items for newly created transactions to avoid duplicates on re-seed
            if ($transaction->wasRecentlyCreated) {
                foreach ($itemsToCreate as $item) {
                    TransactionItem::create(array_merge($item, [
                        'transaction_id' => $transaction->id,
                    ]));
                }
            }
        }

        // === Customers ===
        $customers = [
            ['name' => 'Siti Rahmawati', 'email' => 'siti@email.com', 'phone' => '081234567890', 'address' => 'Jl. Merdeka No. 45, Jakarta', 'member_code' => 'MBR-001', 'loyalty_points' => 1500, 'total_spent' => 2500000, 'birth_date' => '1990-05-12'],
            ['name' => 'Bambang Susilo', 'email' => 'bambang@email.com', 'phone' => '081298765432', 'address' => 'Jl. Sudirman No. 12, Bandung', 'member_code' => 'MBR-002', 'loyalty_points' => 800, 'total_spent' => 1200000, 'birth_date' => '1985-11-23'],
            ['name' => 'Dewi Sartika', 'email' => 'dewi@email.com', 'phone' => '087812345678', 'address' => 'Jl. Diponegoro No. 78, Surabaya', 'member_code' => 'MBR-003', 'loyalty_points' => 2500, 'total_spent' => 4500000, 'birth_date' => '1992-08-07'],
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad@email.com', 'phone' => '085612345678', 'address' => 'Jl. Gatot Subroto No. 34, Yogyakarta', 'member_code' => 'MBR-004', 'loyalty_points' => 500, 'total_spent' => 750000, 'birth_date' => '1998-02-19'],
            ['name' => 'Rina Marlina', 'email' => 'rina@email.com', 'phone' => '082134567890', 'address' => 'Jl. Pahlawan No. 56, Semarang', 'member_code' => 'MBR-005', 'loyalty_points' => 1200, 'total_spent' => 1800000, 'birth_date' => '1995-07-30'],
        ];
        foreach ($customers as $c) {
            Customer::firstOrCreate(['email' => $c['email']], $c);
        }

        // === Suppliers ===
        $suppliers = [
            ['name' => 'PT Elektronik Maju', 'company' => 'PT Elektronik Maju Jaya', 'email' => 'info@elektronikmaju.com', 'phone' => '021-5551234', 'address' => 'Kawasan Industri Pulogadung, Jakarta Timur', 'tax_id' => '01.234.567.8-901.000'],
            ['name' => 'CV Sumber Pangan', 'company' => 'CV Sumber Pangan Sejahtera', 'email' => 'sales@sumberpangan.com', 'phone' => '0274-555678', 'address' => 'Jl. Magelang Km. 8, Sleman, Yogyakarta', 'tax_id' => '02.345.678.9-012.000'],
            ['name' => 'PT Fashion Indah', 'company' => 'PT Fashion Indah Perkasa', 'email' => 'order@fashionindah.com', 'phone' => '031-5559012', 'address' => 'Jl. Raya Darmo No. 88, Surabaya', 'tax_id' => '03.456.789.0-123.000'],
            ['name' => 'UD Rumah Tangga', 'company' => 'UD Rumah Tangga Makmur', 'email' => 'cs@rumahtangga.com', 'phone' => '0361-555345', 'address' => 'Jl. Sunset Road No. 12, Denpasar, Bali', 'tax_id' => '04.567.890.1-234.000'],
        ];
        foreach ($suppliers as $s) {
            Supplier::firstOrCreate(['email' => $s['email']], $s);
        }

        // === Discounts ===
        $discounts = [
            ['name' => 'Grand Opening Sale', 'code' => 'GRAND10', 'type' => 'percentage', 'value' => 10, 'min_purchase' => 100000, 'max_uses' => 100, 'used_count' => 23, 'start_date' => now()->subDays(30), 'end_date' => now()->addDays(30), 'description' => '10% off for grand opening celebration!'],
            ['name' => 'Belanja Banyak Hemat', 'code' => 'BELANJA50', 'type' => 'fixed', 'value' => 50000, 'min_purchase' => 300000, 'max_uses' => 50, 'used_count' => 8, 'start_date' => now()->subDays(15), 'end_date' => now()->addDays(15), 'description' => 'Diskon Rp 50.000 untuk minimal belanja Rp 300.000'],
            ['name' => 'Potongan Member Baru', 'code' => 'NEW20', 'type' => 'percentage', 'value' => 20, 'min_purchase' => 50000, 'max_uses' => 200, 'used_count' => 45, 'start_date' => now()->subDays(7), 'end_date' => now()->addDays(60), 'description' => 'Diskon 20% untuk member baru!'],
            ['name' => 'Flash Sale Akhir Pekan', 'code' => 'WEEKEND15', 'type' => 'percentage', 'value' => 15, 'min_purchase' => 50000, 'max_uses' => 150, 'used_count' => 67, 'start_date' => now(), 'end_date' => now()->addDays(2), 'description' => 'Flash sale akhir pekan — diskon 15%!'],
        ];
        foreach ($discounts as $d) {
            Discount::firstOrCreate(['code' => $d['code']], $d);
        }

        // === Stores ===
        $stores = [
            ['name' => 'BikinPOS Pusat', 'code' => 'PST', 'address' => 'Jl. Thamrin No. 1, Jakarta Pusat', 'phone' => '021-5550101', 'email' => 'pusat@bikinpos.com'],
            ['name' => 'BikinPOS Cabang Bandung', 'code' => 'BDG', 'address' => 'Jl. Braga No. 25, Bandung', 'phone' => '022-5550202', 'email' => 'bandung@bikinpos.com'],
        ];
        foreach ($stores as $s) {
            Store::firstOrCreate(['code' => $s['code']], $s);
        }

        // === Settings ===
        $settingData = [
            ['key' => 'app_name', 'value' => 'BikinPOS Enterprise', 'group' => 'general'],
            ['key' => 'app_description', 'value' => 'Premium Point of Sale System for Modern Retail', 'group' => 'general'],
            ['key' => 'currency', 'value' => 'IDR', 'group' => 'general'],
            ['key' => 'tax_rate', 'value' => '11', 'group' => 'general'],
            ['key' => 'company_name', 'value' => 'PT BikinPOS Teknologi Indonesia', 'group' => 'business'],
            ['key' => 'company_address', 'value' => 'Jl. Thamrin No. 1, Jakarta Pusat', 'group' => 'business'],
            ['key' => 'company_phone', 'value' => '021-5550101', 'group' => 'business'],
            ['key' => 'company_email', 'value' => 'hello@bikinpos.com', 'group' => 'business'],
            ['key' => 'tax_id', 'value' => '12.345.678.9-012.345', 'group' => 'business'],
            ['key' => 'receipt_footer', 'value' => 'Terima kasih telah berbelanja di BikinPOS!', 'group' => 'receipt'],
            ['key' => 'receipt_header', 'value' => 'BikinPOS Enterprise — Premium Retail Solution', 'group' => 'receipt'],
            ['key' => 'show_logo', 'value' => 'true', 'group' => 'receipt'],
            ['key' => 'low_stock_alert', 'value' => 'true', 'group' => 'notifications'],
            ['key' => 'daily_report', 'value' => 'true', 'group' => 'notifications'],
            ['key' => 'email_notifications', 'value' => 'true', 'group' => 'notifications'],
        ];
        foreach ($settingData as $s) {
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        // === User Alerts ===
        $alerts = [
            ['user_id' => $admin->id, 'type' => 'info', 'title' => 'Selamat Datang!', 'message' => 'Selamat datang di BikinPOS Enterprise. Mulai kelola bisnis Anda dengan lebih mudah!', 'is_read' => false],
            ['user_id' => $admin->id, 'type' => 'success', 'title' => 'Sistem Siap Digunakan', 'message' => 'Semua fitur telah aktif. Anda dapat mulai melakukan transaksi POS sekarang.', 'is_read' => false],
            ['user_id' => $demoUser->id, 'type' => 'info', 'title' => 'Welcome to Demo Mode!', 'message' => 'You are in demo mode. All data shown is dummy data for demonstration purposes.', 'is_read' => false],
            ['user_id' => $cashier->id, 'type' => 'info', 'title' => 'Shift Dimulai', 'message' => 'Selamat bertugas! Pastikan untuk memeriksa stok produk sebelum memulai transaksi.', 'is_read' => false],
        ];
        foreach ($alerts as $a) {
            UserAlert::firstOrCreate(
                ['user_id' => $a['user_id'], 'title' => $a['title']],
                $a
            );
        }
    }
}
