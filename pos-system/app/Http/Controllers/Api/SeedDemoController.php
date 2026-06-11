<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
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
use Illuminate\Http\Request;

class SeedDemoController extends Controller
{
    public function seed()
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated',
            ], 401);
        }

        // Check if data already exists to avoid duplicates
        $productCount = Product::count();
        if ($productCount > 0) {
            return response()->json([
                'status' => 'success',
                'message' => 'Demo data already seeded',
                'data' => [
                    'products_count' => $productCount,
                ],
            ]);
        }

        try {
            $this->seedCategories();
            $createdProducts = $this->seedProducts();
            $this->seedCustomers();
            $this->seedSuppliers();
            $this->seedDiscounts();
            $this->seedStores();
            $this->seedSettings();
            $this->seedTransactions($user);

            // User Alert for demo user
            UserAlert::create([
                'user_id' => $user->id,
                'type' => 'success',
                'title' => '🎉 Demo Data Siap!',
                'message' => 'Data demo telah berhasil dimuat. Anda bisa menjelajahi semua fitur BikinPOS dengan data contoh yang sudah disediakan.',
                'is_read' => false,
            ]);

            $stats = [
                'products' => Product::count(),
                'categories' => Category::count(),
                'customers' => Customer::count(),
                'suppliers' => Supplier::count(),
                'discounts' => Discount::count(),
                'stores' => Store::count(),
            ];

            return response()->json([
                'status' => 'success',
                'message' => 'Demo data seeded successfully! 🎉',
                'data' => $stats,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to seed demo data: ' . $e->getMessage(),
            ], 500);
        }
    }
  
    private function seedCategories()
    {
        $categories = [
            ['name' => 'Electronics', 'slug' => 'electronics', 'description' => 'Electronic devices and accessories'],
            ['name' => 'Food & Beverage', 'slug' => 'food-beverage', 'description' => 'Food and drink items'],
            ['name' => 'Clothing', 'slug' => 'clothing', 'description' => 'Clothes and fashion items'],
            ['name' => 'Home & Garden', 'slug' => 'home-garden', 'description' => 'Home and garden supplies'],
        ];
        foreach ($categories as $category) {
            Category::create($category);
        }
    }

    private function seedProducts()
    {
        $products = [
            ['category_id' => 1, 'sku' => 'ELEC-001', 'name' => 'Wireless Mouse', 'purchase_price' => 50000, 'selling_price' => 75000, 'stock' => 50, 'min_stock' => 10],
            ['category_id' => 1, 'sku' => 'ELEC-002', 'name' => 'USB Keyboard', 'purchase_price' => 100000, 'selling_price' => 150000, 'stock' => 30, 'min_stock' => 5],
            ['category_id' => 1, 'sku' => 'ELEC-003', 'name' => 'USB Hub 4 Port', 'purchase_price' => 35000, 'selling_price' => 55000, 'stock' => 40, 'min_stock' => 8],
            ['category_id' => 1, 'sku' => 'ELEC-004', 'name' => 'Headset Gaming', 'purchase_price' => 120000, 'selling_price' => 185000, 'stock' => 20, 'min_stock' => 5],
            ['category_id' => 1, 'sku' => 'ELEC-005', 'name' => 'Kabel HDMI 2m', 'purchase_price' => 25000, 'selling_price' => 45000, 'stock' => 60, 'min_stock' => 10],
            ['category_id' => 2, 'sku' => 'FOOD-001', 'name' => 'Mineral Water 600ml', 'purchase_price' => 2000, 'selling_price' => 3500, 'stock' => 200, 'min_stock' => 50],
            ['category_id' => 2, 'sku' => 'FOOD-002', 'name' => 'Teh Botol 450ml', 'purchase_price' => 3000, 'selling_price' => 5000, 'stock' => 150, 'min_stock' => 30],
            ['category_id' => 2, 'sku' => 'FOOD-003', 'name' => 'Kopi Kaleng', 'purchase_price' => 5000, 'selling_price' => 8000, 'stock' => 100, 'min_stock' => 20],
            ['category_id' => 2, 'sku' => 'FOOD-004', 'name' => 'Snack Keripik', 'purchase_price' => 7000, 'selling_price' => 12000, 'stock' => 80, 'min_stock' => 15],
            ['category_id' => 2, 'sku' => 'FOOD-005', 'name' => 'Mie Instan Cup', 'purchase_price' => 3500, 'selling_price' => 5500, 'stock' => 120, 'min_stock' => 25],
            ['category_id' => 3, 'sku' => 'CLO-001', 'name' => 'Kaos Polos Hitam', 'purchase_price' => 35000, 'selling_price' => 65000, 'stock' => 40, 'min_stock' => 10],
            ['category_id' => 3, 'sku' => 'CLO-002', 'name' => 'Kaos Polos Putih', 'purchase_price' => 35000, 'selling_price' => 65000, 'stock' => 40, 'min_stock' => 10],
            ['category_id' => 3, 'sku' => 'CLO-003', 'name' => 'Topi Baseball', 'purchase_price' => 25000, 'selling_price' => 45000, 'stock' => 30, 'min_stock' => 10],
            ['category_id' => 4, 'sku' => 'HOME-001', 'name' => 'Lampu LED 12W', 'purchase_price' => 15000, 'selling_price' => 28000, 'stock' => 100, 'min_stock' => 20],
            ['category_id' => 4, 'sku' => 'HOME-002', 'name' => 'Stop Kontak 3 Lubang', 'purchase_price' => 20000, 'selling_price' => 35000, 'stock' => 50, 'min_stock' => 10],
        ];
        $createdProducts = [];
        foreach ($products as $item) {
            $data = array_merge($item, ['slug' => Str::slug($item['name']), 'unit' => 'pcs']);
            $createdProducts[] = Product::create($data);
        }
        return $createdProducts;
    }

    private function seedCustomers()
    {
        $customers = [
            ['name' => 'Siti Rahmawati', 'email' => 'siti@email.com', 'phone' => '081234567890', 'address' => 'Jl. Merdeka No. 45, Jakarta', 'member_code' => 'MBR-001', 'loyalty_points' => 1500, 'total_spent' => 2500000],
            ['name' => 'Bambang Susilo', 'email' => 'bambang@email.com', 'phone' => '081298765432', 'address' => 'Jl. Sudirman No. 12, Bandung', 'member_code' => 'MBR-002', 'loyalty_points' => 800, 'total_spent' => 1200000],
            ['name' => 'Dewi Sartika', 'email' => 'dewi@email.com', 'phone' => '087812345678', 'address' => 'Jl. Diponegoro No. 78, Surabaya', 'member_code' => 'MBR-003', 'loyalty_points' => 2500, 'total_spent' => 4500000],
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad@email.com', 'phone' => '085612345678', 'address' => 'Jl. Gatot Subroto No. 34, Yogyakarta', 'member_code' => 'MBR-004', 'loyalty_points' => 500, 'total_spent' => 750000],
            ['name' => 'Rina Marlina', 'email' => 'rina@email.com', 'phone' => '082134567890', 'address' => 'Jl. Pahlawan No. 56, Semarang', 'member_code' => 'MBR-005', 'loyalty_points' => 1200, 'total_spent' => 1800000],
        ];
        foreach ($customers as $c) { Customer::create($c); }
    }

    private function seedSuppliers()
    {
        $suppliers = [
            ['name' => 'PT Elektronik Maju', 'company' => 'PT Elektronik Maju Jaya', 'email' => 'info@elektronikmaju.com', 'phone' => '021-5551234', 'address' => 'Kawasan Industri Pulogadung, Jakarta Timur', 'tax_id' => '01.234.567.8-901.000'],
            ['name' => 'CV Sumber Pangan', 'company' => 'CV Sumber Pangan Sejahtera', 'email' => 'sales@sumberpangan.com', 'phone' => '0274-555678', 'address' => 'Jl. Magelang Km. 8, Sleman, Yogyakarta', 'tax_id' => '02.345.678.9-012.000'],
            ['name' => 'PT Fashion Indah', 'company' => 'PT Fashion Indah Perkasa', 'email' => 'order@fashionindah.com', 'phone' => '031-5559012', 'address' => 'Jl. Raya Darmo No. 88, Surabaya', 'tax_id' => '03.456.789.0-123.000'],
            ['name' => 'UD Rumah Tangga', 'company' => 'UD Rumah Tangga Makmur', 'email' => 'cs@rumahtangga.com', 'phone' => '0361-555345', 'address' => 'Jl. Sunset Road No. 12, Denpasar, Bali', 'tax_id' => '04.567.890.1-234.000'],
        ];
        foreach ($suppliers as $s) { Supplier::create($s); }
    }

    private function seedDiscounts()
    {
        $discounts = [
            ['name' => 'Grand Opening Sale', 'code' => 'GRAND10', 'type' => 'percentage', 'value' => 10, 'min_purchase' => 100000, 'max_uses' => 100, 'used_count' => 23, 'start_date' => now()->subDays(30), 'end_date' => now()->addDays(30), 'description' => '10% off for grand opening celebration!'],
            ['name' => 'Belanja Banyak Hemat', 'code' => 'BELANJA50', 'type' => 'fixed', 'value' => 50000, 'min_purchase' => 300000, 'max_uses' => 50, 'used_count' => 8, 'start_date' => now()->subDays(15), 'end_date' => now()->addDays(15), 'description' => 'Diskon Rp 50.000 untuk minimal belanja Rp 300.000'],
            ['name' => 'Potongan Member Baru', 'code' => 'NEW20', 'type' => 'percentage', 'value' => 20, 'min_purchase' => 50000, 'max_uses' => 200, 'used_count' => 45, 'start_date' => now()->subDays(7), 'end_date' => now()->addDays(60), 'description' => 'Diskon 20% untuk member baru!'],
            ['name' => 'Flash Sale Akhir Pekan', 'code' => 'WEEKEND15', 'type' => 'percentage', 'value' => 15, 'min_purchase' => 50000, 'max_uses' => 150, 'used_count' => 67, 'start_date' => now(), 'end_date' => now()->addDays(2), 'description' => 'Flash sale akhir pekan — diskon 15%!'],
        ];
        foreach ($discounts as $d) { Discount::create($d); }
    }

    private function seedStores()
    {
        $stores = [
            ['name' => 'BikinPOS Pusat', 'code' => 'PST', 'address' => 'Jl. Thamrin No. 1, Jakarta Pusat', 'phone' => '021-5550101', 'email' => 'pusat@bikinpos.com'],
            ['name' => 'BikinPOS Cabang Bandung', 'code' => 'BDG', 'address' => 'Jl. Braga No. 25, Bandung', 'phone' => '022-5550202', 'email' => 'bandung@bikinpos.com'],
        ];
        foreach ($stores as $s) { Store::create($s); }
    }

    private function seedSettings()
    {
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
        foreach ($settingData as $s) { Setting::create($s); }
    }

    private function seedTransactions($user)
    {
        $products = Product::all();
        $now = now();

        // Seed transactions for the last 14 days
        for ($i = 14; $i >= 0; $i--) {
            $date = (clone $now)->subDays($i);
            
            // 3-7 transactions per day
            $txCount = rand(3, 7);
            for ($j = 0; $j < $txCount; $j++) {
                $txDate = (clone $date)->setHour(rand(9, 21))->setMinute(rand(0, 59));
                
                $transaction = Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'sale',
                    'status' => 'paid',
                    'subtotal' => 0,
                    'tax' => 0,
                    'discount' => 0,
                    'total' => 0,
                    'paid_amount' => 0,
                    'payment_method' => rand(0, 1) ? 'cash' : 'qris',
                    'created_at' => $txDate,
                    'completed_at' => $txDate,
                ]);

                $subtotal = 0;
                $itemsCount = rand(1, 4);
                $randomProducts = $products->random($itemsCount);

                foreach ($randomProducts as $product) {
                    $qty = rand(1, 3);
                    $lineSubtotal = $product->selling_price * $qty;
                    $subtotal += $lineSubtotal;

                    TransactionItem::create([
                        'transaction_id' => $transaction->id,
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'purchase_price' => $product->purchase_price,
                        'selling_price' => $product->selling_price,
                        'subtotal' => $lineSubtotal,
                        'created_at' => $txDate,
                    ]);
                }

                $transaction->update([
                    'subtotal' => $subtotal,
                    'total' => $subtotal,
                    'paid_amount' => $subtotal,
                ]);
            }
        }
    }
}
