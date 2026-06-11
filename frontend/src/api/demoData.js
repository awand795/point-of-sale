/**
 * Demo Data Module - Provides mock data for demo mode
 */

const now = new Date();

const demoUser = {
    id: 1, name: 'Demo User', email: 'demo@example.com',
    phone: '081234567890', is_active: true,
    last_login_at: now.toISOString(), created_at: now.toISOString(),
    roles: [{ id: 1, name: 'admin', guard_name: 'web' }],
};

const categories = [
    { id: 1, name: 'Electronics', slug: 'electronics', description: 'Electronic devices and accessories', is_active: true, products_count: 5 },
    { id: 2, name: 'Food & Beverage', slug: 'food-beverage', description: 'Food and drink items', is_active: true, products_count: 5 },
    { id: 3, name: 'Clothing', slug: 'clothing', description: 'Clothes and fashion items', is_active: true, products_count: 3 },
    { id: 4, name: 'Home & Garden', slug: 'home-garden', description: 'Home and garden supplies', is_active: true, products_count: 2 },
].map(c => ({ ...c, created_at: now.toISOString(), updated_at: now.toISOString() }));

const cat = (i) => categories[i-1];

const products = [
    { id: 1, category_id: 1, category: cat(1), sku: 'ELEC-001', name: 'Wireless Mouse', purchase_price: 50000, selling_price: 75000, stock: 50, min_stock: 10, unit: 'pcs', is_active: true },
    { id: 2, category_id: 1, category: cat(1), sku: 'ELEC-002', name: 'USB Keyboard', purchase_price: 100000, selling_price: 150000, stock: 30, min_stock: 5, unit: 'pcs', is_active: true },
    { id: 3, category_id: 1, category: cat(1), sku: 'ELEC-003', name: 'USB Hub 4 Port', purchase_price: 35000, selling_price: 55000, stock: 40, min_stock: 8, unit: 'pcs', is_active: true },
    { id: 4, category_id: 1, category: cat(1), sku: 'ELEC-004', name: 'Headset Gaming', purchase_price: 120000, selling_price: 185000, stock: 20, min_stock: 5, unit: 'pcs', is_active: true },
    { id: 5, category_id: 1, category: cat(1), sku: 'ELEC-005', name: 'Kabel HDMI 2m', purchase_price: 25000, selling_price: 45000, stock: 60, min_stock: 10, unit: 'pcs', is_active: true },
    { id: 6, category_id: 2, category: cat(2), sku: 'FOOD-001', name: 'Mineral Water 600ml', purchase_price: 2000, selling_price: 3500, stock: 200, min_stock: 50, unit: 'pcs', is_active: true },
    { id: 7, category_id: 2, category: cat(2), sku: 'FOOD-002', name: 'Teh Botol 450ml', purchase_price: 3000, selling_price: 5000, stock: 150, min_stock: 30, unit: 'pcs', is_active: true },
    { id: 8, category_id: 2, category: cat(2), sku: 'FOOD-003', name: 'Kopi Kaleng', purchase_price: 5000, selling_price: 8000, stock: 100, min_stock: 20, unit: 'pcs', is_active: true },
    { id: 9, category_id: 2, category: cat(2), sku: 'FOOD-004', name: 'Snack Keripik', purchase_price: 7000, selling_price: 12000, stock: 80, min_stock: 15, unit: 'pcs', is_active: true },
    { id: 10, category_id: 2, category: cat(2), sku: 'FOOD-005', name: 'Mie Instan Cup', purchase_price: 3500, selling_price: 5500, stock: 120, min_stock: 25, unit: 'pcs', is_active: true },
    { id: 11, category_id: 3, category: cat(3), sku: 'CLO-001', name: 'Kaos Polos Hitam', purchase_price: 35000, selling_price: 65000, stock: 40, min_stock: 10, unit: 'pcs', is_active: true },
    { id: 12, category_id: 3, category: cat(3), sku: 'CLO-002', name: 'Kaos Polos Putih', purchase_price: 35000, selling_price: 65000, stock: 40, min_stock: 10, unit: 'pcs', is_active: true },
    { id: 13, category_id: 3, category: cat(3), sku: 'CLO-003', name: 'Topi Baseball', purchase_price: 25000, selling_price: 45000, stock: 30, min_stock: 10, unit: 'pcs', is_active: true },
    { id: 14, category_id: 4, category: cat(4), sku: 'HOME-001', name: 'Lampu LED 12W', purchase_price: 15000, selling_price: 28000, stock: 100, min_stock: 20, unit: 'pcs', is_active: true },
    { id: 15, category_id: 4, category: cat(4), sku: 'HOME-002', name: 'Stop Kontak 3 Lubang', purchase_price: 20000, selling_price: 35000, stock: 50, min_stock: 10, unit: 'pcs', is_active: true },
].map(p => ({ ...p, created_at: now.toISOString() }));

const customers = [
    { id: 1, name: 'Siti Rahmawati', email: 'siti@email.com', phone: '081234567890', address: 'Jl. Merdeka No. 45, Jakarta', member_code: 'MBR-001', loyalty_points: 1500, total_spent: 2500000, is_active: true },
    { id: 2, name: 'Bambang Susilo', email: 'bambang@email.com', phone: '081298765432', address: 'Jl. Sudirman No. 12, Bandung', member_code: 'MBR-002', loyalty_points: 800, total_spent: 1200000, is_active: true },
    { id: 3, name: 'Dewi Sartika', email: 'dewi@email.com', phone: '087812345678', address: 'Jl. Diponegoro No. 78, Surabaya', member_code: 'MBR-003', loyalty_points: 2500, total_spent: 4500000, is_active: true },
    { id: 4, name: 'Ahmad Fauzi', email: 'ahmad@email.com', phone: '085612345678', address: 'Jl. Gatot Subroto No. 34, Yogyakarta', member_code: 'MBR-004', loyalty_points: 500, total_spent: 750000, is_active: true },
    { id: 5, name: 'Rina Marlina', email: 'rina@email.com', phone: '082134567890', address: 'Jl. Pahlawan No. 56, Semarang', member_code: 'MBR-005', loyalty_points: 1200, total_spent: 1800000, is_active: true },
].map(c => ({ ...c, created_at: now.toISOString() }));

const suppliers = [
    { id: 1, name: 'PT Elektronik Maju', company: 'PT Elektronik Maju Jaya', email: 'info@elektronikmaju.com', phone: '021-5551234', address: 'Kawasan Industri Pulogadung, Jakarta Timur', tax_id: '01.234.567.8-901.000', is_active: true },
    { id: 2, name: 'CV Sumber Pangan', company: 'CV Sumber Pangan Sejahtera', email: 'sales@sumberpangan.com', phone: '0274-555678', address: 'Jl. Magelang Km. 8, Sleman, Yogyakarta', tax_id: '02.345.678.9-012.000', is_active: true },
    { id: 3, name: 'PT Fashion Indah', company: 'PT Fashion Indah Perkasa', email: 'order@fashionindah.com', phone: '031-5559012', address: 'Jl. Raya Darmo No. 88, Surabaya', tax_id: '03.456.789.0-123.000', is_active: true },
    { id: 4, name: 'UD Rumah Tangga', company: 'UD Rumah Tangga Makmur', email: 'cs@rumahtangga.com', phone: '0361-555345', address: 'Jl. Sunset Road No. 12, Denpasar, Bali', tax_id: '04.567.890.1-234.000', is_active: true },
].map(s => ({ ...s, created_at: now.toISOString() }));

const discounts = [
    { id: 1, name: 'Grand Opening Sale', code: 'GRAND10', type: 'percentage', value: 10, min_purchase: 100000, max_uses: 100, used_count: 23, description: '10% off for grand opening!', is_active: true },
    { id: 2, name: 'Belanja Banyak Hemat', code: 'BELANJA50', type: 'fixed', value: 50000, min_purchase: 300000, max_uses: 50, used_count: 8, description: 'Diskon Rp 50.000', is_active: true },
    { id: 3, name: 'Potongan Member Baru', code: 'NEW20', type: 'percentage', value: 20, min_purchase: 50000, max_uses: 200, used_count: 45, description: 'Diskon 20% untuk member baru!', is_active: true },
    { id: 4, name: 'Flash Sale Akhir Pekan', code: 'WEEKEND15', type: 'percentage', value: 15, min_purchase: 50000, max_uses: 150, used_count: 67, description: 'Flash sale akhir pekan — diskon 15%!', is_active: true },
].map(d => ({ ...d, start_date: now.toISOString().split('T')[0], end_date: new Date(now.getTime()+30*86400000).toISOString().split('T')[0], created_at: now.toISOString() }));

const stores = [
    { id: 1, name: 'BikinPOS Pusat', code: 'PST', address: 'Jl. Thamrin No. 1, Jakarta Pusat', phone: '021-5550101', email: 'pusat@bikinpos.com', is_active: true },
    { id: 2, name: 'BikinPOS Cabang Bandung', code: 'BDG', address: 'Jl. Braga No. 25, Bandung', phone: '022-5550202', email: 'bandung@bikinpos.com', is_active: true },
].map(s => ({ ...s, created_at: now.toISOString() }));

const purchases = [{
    id: 1, invoice_number: 'PO-001', supplier_id: 1, supplier: suppliers[0], user_id: 1, user: { id: 1, name: 'Demo User' },
    status: 'received', subtotal: 500000, discount: 0, tax: 0, total: 500000,
    created_at: now.toISOString(), received_at: now.toISOString(),
    items: [{ id: 1, product_id: 1, product: products[0], quantity: 10, purchase_price: 50000, subtotal: 500000 }],
}];

const settings = {
    general: [{ key: 'app_name', value: 'BikinPOS Enterprise', group: 'general' }, { key: 'currency', value: 'IDR', group: 'general' }, { key: 'tax_rate', value: '11', group: 'general' }],
    business: [{ key: 'company_name', value: 'PT BikinPOS Teknologi Indonesia', group: 'business' }, { key: 'company_email', value: 'hello@bikinpos.com', group: 'business' }],
    receipt: [{ key: 'receipt_footer', value: 'Terima kasih!', group: 'receipt' }],
    pdf: [
        { key: 'pdf_header_text', value: 'PT BikinPOS Teknologi Indonesia | Jl. Thamrin No. 1, Jakarta Pusat', group: 'pdf' },
        { key: 'pdf_footer_text', value: 'Terima kasih sudah berbelanja! — www.bikinpos.com', group: 'pdf' },
    ],
    notifications: [{ key: 'low_stock_alert', value: 'true', group: 'notifications' }],
};

const users = [
    { id: 1, name: 'Demo User', email: 'demo@example.com', phone: '081234567890', is_active: true, last_login_at: now.toISOString(), roles: [{ id: 1, name: 'admin' }] },
    { id: 2, name: 'Admin User', email: 'admin@example.com', phone: '081298765432', is_active: true, last_login_at: now.toISOString(), roles: [{ id: 1, name: 'admin' }] },
    { id: 3, name: 'Budi Kasir', email: 'cashier@example.com', phone: '087812345678', is_active: true, last_login_at: now.toISOString(), roles: [{ id: 2, name: 'cashier' }] },
].map(u => ({ ...u, created_at: now.toISOString() }));

// ─── Lazy-generated demo transactions & stats ───
// Generates realistic transactions spread across today (per hour) & past 7 days,
// then computes dashboard stats (hourly/weekly/monthly sales) from them.

let _demoData = null;

function getDemoData() {
    if (_demoData) return _demoData;

    const _now = new Date();
    const txList = [];
    let txId = 1;
    let itemId = 1;

    function pickItems() {
        const count = 1 + Math.floor(Math.random() * 3);
        const map = {};
        for (let i = 0; i < count; i++) {
            const idx = Math.floor(Math.random() * products.length);
            const p = products[idx];
            const qty = 1 + Math.floor(Math.random() * (p.selling_price > 50000 ? 2 : 4));
            if (map[p.id]) map[p.id].quantity += qty;
            else map[p.id] = { product: p, quantity: qty };
        }
        return Object.values(map);
    }

    function makeTx(date, items) {
        const txItems = items.map(({ product, quantity }) => ({
            id: itemId++,
            product_id: product.id,
            product,
            quantity,
            purchase_price: product.purchase_price,
            selling_price: product.selling_price,
            subtotal: product.selling_price * quantity,
        }));
        const subtotal = txItems.reduce((s, i) => s + i.subtotal, 0);
        const currentId = txId++;
        return {
            id: currentId,
            invoice_number: `INV-${String(currentId).padStart(6, '0')}`,
            user_id: 1,
            user: { id: 1, name: 'Demo User' },
            type: 'sale',
            status: 'paid',
            subtotal,
            tax: 0,
            discount: 0,
            total: subtotal,
            paid_amount: subtotal,
            payment_method: Math.random() > 0.5 ? 'cash' : 'qris',
            created_at: date.toISOString(),
            completed_at: date.toISOString(),
            items: txItems,
        };
    }

    // 1) TODAY: 1-2 tx per business hour (08:00 – 21:00) that have already passed
    for (let hour = 8; hour <= 21; hour++) {
        const txHour = 1 + Math.floor(Math.random() * 2); // 1 or 2 tx per hour
        for (let i = 0; i < txHour; i++) {
            const d = new Date(_now);
            d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
            if (d <= _now) txList.push(makeTx(d, pickItems()));
        }
    }

    // 2) PAST 7 DAYS: 2-4 tx per day
    for (let day = 1; day <= 7; day++) {
        const txPerDay = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < txPerDay; i++) {
            const d = new Date(_now);
            d.setDate(d.getDate() - day);
            d.setHours(8 + Math.floor(Math.random() * 12), Math.floor(Math.random() * 60), 0, 0);
            txList.push(makeTx(d, pickItems()));
        }
    }

    // Sort most-recent-first
    txList.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // ── Compute stats from generated transactions ──
    const todayStart = new Date(_now);
    todayStart.setHours(0, 0, 0, 0);

    const todayTx = txList.filter(tx => new Date(tx.created_at) >= todayStart);
    const todaySales = todayTx.reduce((s, tx) => s + tx.total, 0);
    const todayTxCount = todayTx.length;
    const todayItemsSold = todayTx.reduce((s, tx) => s + tx.items.reduce((si, i) => si + i.quantity, 0), 0);

    // Hourly sales today (24 slots)
    const hourlySales = Array(24).fill(0);
    todayTx.forEach(tx => { hourlySales[new Date(tx.created_at).getHours()] += tx.total; });

    // Weekly sales (Mon–Sun, 7 slots)
    const weekStart = new Date(_now);
    const dow = weekStart.getDay(); // 0=Sun,1=Mon,...
    weekStart.setDate(weekStart.getDate() + (dow === 0 ? -6 : 1 - dow));
    weekStart.setHours(0, 0, 0, 0);
    const weeklySales = Array(7).fill(0);
    txList.forEach(tx => {
        const d = new Date(tx.created_at);
        if (d >= weekStart) weeklySales[(d.getDay() + 6) % 7] += tx.total;
    });

    // Monthly sales (by day of month)
    const monthStart = new Date(_now.getFullYear(), _now.getMonth(), 1);
    const daysInMonth = new Date(_now.getFullYear(), _now.getMonth() + 1, 0).getDate();
    const monthlySales = Array(daysInMonth).fill(0);
    txList.forEach(tx => {
        const d = new Date(tx.created_at);
        if (d >= monthStart) monthlySales[d.getDate() - 1] += tx.total;
    });

    // Top products (aggregated across all generated tx)
    const prodAgg = {};
    txList.forEach(tx =>
        tx.items.forEach(item => {
            if (prodAgg[item.product_id]) {
                prodAgg[item.product_id].total_sold += item.quantity;
                prodAgg[item.product_id].revenue += item.subtotal;
            } else {
                prodAgg[item.product_id] = {
                    product: item.product,
                    total_sold: item.quantity,
                    revenue: item.subtotal,
                };
            }
        })
    );

    const topBySold = Object.values(prodAgg).sort((a, b) => b.total_sold - a.total_sold);
    const top5Dashboard = topBySold.slice(0, 5).map(({ product, total_sold }) => ({ product, total_sold }));
    const top5Report = topBySold.slice(0, 5).map(({ product, total_sold, revenue }) => ({
        name: product.name,
        total_sold,
        revenue,
        category: product.category?.name || '',
    }));

    // Category breakdown
    const catAgg = {};
    Object.values(prodAgg).forEach(({ product, revenue }) => {
        const catName = product.category?.name || 'Others';
        if (catAgg[catName]) catAgg[catName] += revenue;
        else catAgg[catName] = revenue;
    });
    const catTotal = Object.values(catAgg).reduce((s, v) => s + v, 0);
    const categoryBreakdown = Object.entries(catAgg)
        .sort((a, b) => b[1] - a[1])
        .map(([name, revenue]) => ({
            name,
            revenue,
            percentage: catTotal > 0 ? Math.round((revenue / catTotal) * 100) : 0,
        }));

    const allTxTotal = txList.reduce((s, tx) => s + tx.total, 0);
    const allTxItems = txList.reduce((s, tx) => s + tx.items.reduce((si, i) => si + i.quantity, 0), 0);

    // Monthly sales for reports (existing helper)
    const generateMonthlySales = () => {
        const months = [];
        for (let i = 11; i >= 0; i--) {
            const m = new Date(_now.getFullYear(), _now.getMonth() - i, 1);
            const base = 120000 + Math.random() * 180000;
            const peak = m.getMonth() === 11 || m.getMonth() === 0 ? 1.4 : m.getMonth() >= 5 && m.getMonth() <= 7 ? 1.2 : 1;
            months.push({
                month: m.toLocaleString('en-US', { month: 'short' }),
                year: m.getFullYear(),
                revenue: Math.round(base * peak),
                orders: Math.round((base * peak) / 45000),
            });
        }
        return months;
    };

    _demoData = {
        transactions: txList,
        dashboardStats: {
            stats: {
                today_sales: todaySales,
                today_sales_trend: salesTrend,
                today_transactions: todayTxCount,
                today_transactions_trend: txTrend,
                today_items_sold: todayItemsSold,
                today_items_sold_trend: itemsTrend,
                low_stock_products: 0,
                total_products: products.length,
                hourly_sales: hourlySales,
                weekly_sales: weeklySales,
                monthly_sales: monthlySales,
            },
            recent_transactions: txList.slice(0, 5),
            top_products: top5Dashboard,
        },
        reports: {
            total_revenue: allTxTotal,
            total_orders: txList.length,
            total_items: allTxItems,
            avg_order_value: txList.length > 0 ? Math.round(allTxTotal / txList.length) : 0,
            total_revenue_change: 12.5,
            total_orders_change: 8.3,
            total_items_change: 15.2,
            avg_order_value_change: 3.8,
            monthly_sales: generateMonthlySales(),
            yearly_sales: [
                { year: 2022, revenue: 1250000000, orders: 9820 },
                { year: 2023, revenue: 1580000000, orders: 12450 },
                { year: 2024, revenue: 1920000000, orders: 15100 },
                { year: 2025, revenue: 2350000000, orders: 18300 },
                { year: 2026, revenue: 1420000000, orders: 11000 },
            ],
            top_products: top5Report,
            category_breakdown: categoryBreakdown,
        },
    };

    return _demoData;
}

function paginate(data, params = {}) {
    const perPage = parseInt(params.per_page) || 10;
    const page = parseInt(params.page) || 1;
    const total = data.length;
    const lastPage = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    return { current_page: page, data: data.slice(start, start + perPage), last_page: lastPage, per_page: perPage, total: total, from: start + 1, to: Math.min(start + perPage, total) };
}

function searchIn(data, term, fields) {
    if (!term) return data;
    const lower = term.toLowerCase();
    return data.filter(item => fields.some(f => String(item[f] || '').toLowerCase().includes(lower)));
}

const DEMO_BLOCKED_MSG = 'Mode demo: fitur ini tidak tersedia. Silakan login dengan akun sebenarnya untuk melakukan perubahan data.';

const BLOCKED_WRITE_RESOURCES = ['products', 'categories', 'customers', 'suppliers', 'discounts', 'stores', 'purchases', 'transactions', 'settings', 'notifications', 'users'];

function respond(data, status = 200) {
    return { data: data, status: status, headers: {}, config: {} };
}

function isWriteBlocked(method, resource) {
    const writeMethods = ['post', 'put', 'delete', 'patch'];
    return writeMethods.includes(method) && BLOCKED_WRITE_RESOURCES.includes(resource);
}

export function handleDemoRequest(method, url, data, params) {
    // Remove origin if it exists to handle absolute URLs
    let cleanUrl = url;
    try {
        if (url.startsWith('http')) {
            cleanUrl = new URL(url).pathname;
        }
    } catch (e) {
        // Fallback if URL constructor fails
        cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');
    }

    const path = cleanUrl.replace(/^\/api\//, '').replace(/^\//, '');
    const parts = path.split('/');
    const resource = parts[0];
    const id = parts[1];

    // Block all write operations on data resources in demo mode
    if (isWriteBlocked(method, resource)) {
        return respond({ status: 'error', message: DEMO_BLOCKED_MSG }, 403);
    }

    if (resource === 'login' && method === 'post') {
        return respond({ status: 'success', message: 'Login successfully', data: { user: demoUser, token: 'demo-token-bikinpos' } });
    }
    if (resource === 'logout' && method === 'post') {
        return respond({ status: 'success', message: 'Logout successfully' });
    }
    if (resource === 'register' && method === 'post') {
        return respond({ status: 'success', message: 'Register successfully', data: { user: demoUser, token: 'demo-token-bikinpos' } }, 201);
    }
    if (resource === 'me' && method === 'get') {
        return respond({ status: 'success', data: demoUser });
    }
    if (resource === 'seed-demo' && method === 'post') {
        return respond({ status: 'success', message: 'Demo data ready', data: { products_count: products.length } });
    }
    if (method === 'get' && (path === 'dashboard' || path === 'reports')) {
        const demo = getDemoData();
        const data = path === 'dashboard' ? demo.dashboardStats : demo.reports;
        return respond({ status: 'success', data });
    }
    if (resource === 'products') {
        if (method === 'get') {
            let f = [...products];
            if (params?.search) f = searchIn(f, params.search, ['name', 'sku']);
            if (params?.category_id) f = f.filter(p => p.category_id === parseInt(params.category_id));
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', message: 'Product created', data: { ...data, id: Date.now(), category: categories.find(c => c.id === data.category_id) } }, 201);
        if (method === 'put' && id) {
            const idx = products.findIndex(p => p.id === parseInt(id));
            if (idx >= 0) Object.assign(products[idx], data);
            return respond({ status: 'success', message: 'Product updated', data: products[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = products.findIndex(p => p.id === parseInt(id));
            if (idx >= 0) products.splice(idx, 1);
            return respond({ status: 'success', message: 'Product deleted' });
        }
    }
    if (resource === 'categories') {
        if (method === 'get') {
            let f = [...categories];
            if (params?.search) f = searchIn(f, params.search, ['name']);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', message: 'Category created', data: { ...data, id: Date.now(), created_at: now.toISOString() } }, 201);
        if (method === 'put' && id) {
            const idx = categories.findIndex(c => c.id === parseInt(id));
            if (idx >= 0) Object.assign(categories[idx], data);
            return respond({ status: 'success', data: categories[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = categories.findIndex(c => c.id === parseInt(id));
            if (idx >= 0) categories.splice(idx, 1);
            return respond({ status: 'success', message: 'Category deleted' });
        }
    }
    if (resource === 'customers') {
        if (method === 'get') {
            let f = [...customers];
            if (params?.search) f = searchIn(f, params.search, ['name', 'email', 'phone']);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', message: 'Customer created', data: { ...data, id: Date.now(), created_at: now.toISOString() } }, 201);
        if (method === 'put' && id) {
            const idx = customers.findIndex(c => c.id === parseInt(id));
            if (idx >= 0) Object.assign(customers[idx], data);
            return respond({ status: 'success', data: customers[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = customers.findIndex(c => c.id === parseInt(id));
            if (idx >= 0) customers.splice(idx, 1);
            return respond({ status: 'success', message: 'Customer deleted' });
        }
    }
    if (resource === 'suppliers') {
        if (method === 'get') {
            let f = [...suppliers];
            if (params?.search) f = searchIn(f, params.search, ['name', 'company']);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', data: { ...data, id: Date.now() } }, 201);
        if (method === 'put' && id) {
            const idx = suppliers.findIndex(s => s.id === parseInt(id));
            if (idx >= 0) Object.assign(suppliers[idx], data);
            return respond({ status: 'success', data: suppliers[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = suppliers.findIndex(s => s.id === parseInt(id));
            if (idx >= 0) suppliers.splice(idx, 1);
            return respond({ status: 'success', message: 'Supplier deleted' });
        }
    }
    if (resource === 'discounts') {
        if (method === 'get') {
            let f = [...discounts];
            if (params?.search) f = searchIn(f, params.search, ['name', 'code']);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', data: { ...data, id: Date.now(), start_date: now.toISOString().split('T')[0], end_date: new Date(now.getTime()+30*86400000).toISOString().split('T')[0], is_active: true } }, 201);
        if (method === 'put' && id) {
            const idx = discounts.findIndex(d => d.id === parseInt(id));
            if (idx >= 0) Object.assign(discounts[idx], data);
            return respond({ status: 'success', data: discounts[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = discounts.findIndex(d => d.id === parseInt(id));
            if (idx >= 0) discounts.splice(idx, 1);
            return respond({ status: 'success', message: 'Discount deleted' });
        }
    }
    if (resource === 'stores') {
        if (method === 'get') return respond({ status: 'success', data: paginate(stores, params) });
        if (method === 'post') return respond({ status: 'success', data: { ...data, id: Date.now(), is_active: true } }, 201);
        if (method === 'put' && id) {
            const idx = stores.findIndex(s => s.id === parseInt(id));
            if (idx >= 0) Object.assign(stores[idx], data);
            return respond({ status: 'success', data: stores[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = stores.findIndex(s => s.id === parseInt(id));
            if (idx >= 0) stores.splice(idx, 1);
            return respond({ status: 'success', message: 'Store deleted' });
        }
    }
    if (resource === 'purchases') {
        if (method === 'get') {
            let f = [...purchases];
            if (params?.status) f = f.filter(p => p.status === params.status);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', message: 'Purchase created', data: purchases[0] }, 201);
        if (path.includes('receive') && method === 'post') return respond({ status: 'success', message: 'Purchase received' });
    }
    if (resource === 'transactions') {
        if (method === 'get') {
            let f = [...getDemoData().transactions];
            if (params?.status) f = f.filter(t => t.status === params.status);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (method === 'post') return respond({ status: 'success', message: 'Transaction created', data: getDemoData().transactions[0] }, 201);
        if (path.includes('cancel') && method === 'post') return respond({ status: 'success', message: 'Transaction cancelled' });
    }
    if (resource === 'settings') {
        if (method === 'get') return respond({ status: 'success', data: settings });
        if (method === 'put') return respond({ status: 'success', message: 'Settings updated' });
    }
    if (resource === 'notifications') {
        if (method === 'get') return respond({ status: 'success', data: paginate([], params) });
        if (path.includes('read')) return respond({ status: 'success', message: 'Notifications read' });
        if (path.includes('unread-count')) return respond({ status: 'success', data: { count: 0 } });
    }
    if (resource === 'users') {
        if (method === 'get') {
            let f = [...users];
            if (params?.search) f = searchIn(f, params.search, ['name', 'email']);
            return respond({ status: 'success', data: paginate(f, params) });
        }
        if (path.includes('roles') && method === 'get') return respond({ status: 'success', data: ['admin', 'cashier'] });
        if (method === 'post') return respond({ status: 'success', data: { ...data, id: Date.now(), is_active: true, roles: [{ name: data.role || 'cashier' }] } }, 201);
        if (method === 'put' && id) {
            const idx = users.findIndex(u => u.id === parseInt(id));
            if (idx >= 0) Object.assign(users[idx], data);
            return respond({ status: 'success', data: users[idx] || data });
        }
        if (method === 'delete' && id) {
            const idx = users.findIndex(u => u.id === parseInt(id));
            if (idx >= 0) users.splice(idx, 1);
            return respond({ status: 'success', message: 'User deleted' });
        }
    }
    return respond({ status: 'success', data: paginate([], params) });
}