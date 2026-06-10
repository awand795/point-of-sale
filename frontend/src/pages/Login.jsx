import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
    Store,
    Zap,
    ShoppingCart,
    Package,
    Search,
    ArrowRight,
} from 'lucide-react';

const products = [
    { name: 'Nasi Goreng', price: '15.000', stock: 42 },
    { name: 'Mie Ayam', price: '12.000', stock: 28 },
    { name: 'Es Teh Manis', price: '5.000', stock: 120 },
    { name: 'Kopi Susu', price: '8.000', stock: 65 },
    { name: 'Pisang Goreng', price: '7.000', stock: 33 },
    { name: 'Air Mineral', price: '3.000', stock: 200 },
];

const cartItems = [
    { name: 'Nasi Goreng', qty: 2, price: '30.000' },
    { name: 'Es Teh Manis', qty: 1, price: '5.000' },
    { name: 'Pisang Goreng', qty: 1, price: '7.000' },
];

const categories = ['Semua', 'Makanan', 'Minuman', 'Snack', 'Rokok'];

const Login = () => {
    const { login, loading, error } = useAuth();
    const [searchParams] = useSearchParams();
    const { t, locale } = useLanguage();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        if (searchParams.get('demo') === 'true') {
            setFormData({
                email: 'demo@example.com',
                password: 'demo1234'
            });
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData, searchParams.get('demo') === 'true');
    };

    return (
        <div className="min-h-screen flex">
            {/* ═══ Left Panel — Brand Showcase with POS Live Preview ═══ */}
            <div className="hidden lg:flex w-[50%] relative overflow-hidden flex-col justify-between p-10 xl:p-12 transition-colors duration-300"
                style={{ backgroundColor: '#0A0F14' }}
            >
                {/* Subtle teal glow */}
                <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{
                        background:
                            'radial-gradient(ellipse 80% 60% at 0% 0%, rgba(13,92,99,0.25) 0%, transparent 70%)',
                    }}
                />

                {/* Top: Logo */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Store size={22} className="text-white" />
                        </div>
                        <div>
                            <span className="text-[17px] font-bold text-white tracking-[-0.03em]">
                                Bikin<span className="text-primary-400">POS</span>
                            </span>
                            <p className="text-[11px] text-slate-500 font-medium">Enterprise POS System</p>
                        </div>
                    </div>
                </div>

                {/* Middle: POS Live Preview Mockup */}
                <div className="relative z-10 flex items-center justify-center py-4">
                    <div
                        className="w-full max-w-[520px] rounded-2xl overflow-hidden"
                        style={{
                            boxShadow:
                                '0 0 60px rgba(13,92,99,0.12), 0 0 120px rgba(13,92,99,0.06), 0 0 0 1px rgba(255,255,255,0.06)',
                        }}
                    >
                        {/* Top bar */}
                        <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-white/[0.06]"
                            style={{ backgroundColor: '#0D1117' }}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 bg-primary-500 rounded-md flex items-center justify-center">
                                    <Store size={10} className="text-white" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-300">BikinPOS</span>
                            </div>
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md"
                                style={{ backgroundColor: '#161B22' }}
                            >
                                <Search size={11} className="text-slate-500" />
                                <span className="text-[10px] text-slate-500">Cari produk...</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary-500/10">
                                <ShoppingCart size={11} className="text-primary-400" />
                                <span className="text-[10px] font-bold text-primary-400">3</span>
                            </div>
                        </div>

                        {/* Mockup body */}
                        <div className="flex" style={{ minHeight: '200px', backgroundColor: '#0D1117' }}>
                            {/* Category sidebar */}
                            <div className="w-14 shrink-0 border-r border-white/[0.06] p-1.5 space-y-0.5"
                                style={{ backgroundColor: '#0A0F14' }}
                            >
                                {categories.map((cat, i) => (
                                    <div
                                        key={cat}
                                        className={`px-2 py-1.5 rounded-md text-[9px] font-medium transition-colors ${
                                            i === 0
                                                ? 'bg-primary-500 text-white'
                                                : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                                        }`}
                                    >
                                        {cat.slice(0, 4)}
                                    </div>
                                ))}
                            </div>

                            {/* Product grid */}
                            <div className="flex-1 p-2"
                                style={{ backgroundColor: '#F8FAFC' }}
                            >
                                <div className="grid grid-cols-2 gap-1.5">
                                    {products.slice(0, 6).map((p) => (
                                        <div
                                            key={p.name}
                                            className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-primary-300 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <div className="w-4 h-4 rounded bg-primary-100 flex items-center justify-center shrink-0">
                                                    <Package size={8} className="text-primary-600" />
                                                </div>
                                                <span className="text-[9px] font-semibold text-slate-800 truncate">
                                                    {p.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-primary-600">
                                                    Rp{p.price}
                                                </span>
                                                <span className="text-[8px] font-medium text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                                                    {p.stock} stok
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cart panel */}
                            <div className="w-28 shrink-0 border-l border-white/[0.06] flex flex-col"
                                style={{ backgroundColor: '#0A0F14' }}
                            >
                                <div className="px-2.5 py-2 border-b border-white/[0.06]">
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                                        Pesanan
                                    </span>
                                </div>
                                <div className="flex-1 p-2 space-y-1.5">
                                    {cartItems.map((item) => (
                                        <div key={item.name} className="pb-1.5 border-b border-white/[0.06] last:border-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-[9px] font-medium text-slate-300 truncate">
                                                    {item.name}
                                                </span>
                                                <span className="text-[9px] font-semibold text-slate-400">×{item.qty}</span>
                                            </div>
                                            <span className="text-[9px] text-primary-400 font-medium">
                                                Rp{item.price}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-2.5 py-2 border-t border-white/[0.06] space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] text-slate-500">Total</span>
                                        <span className="text-[11px] font-bold text-white">Rp42.000</span>
                                    </div>
                                    <div className="px-2.5 py-1.5 bg-primary-500 text-white text-[9px] font-bold rounded-md text-center">
                                        Bayar
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom: Testimonial */}
                <div className="relative z-10">
                    <div className="flex items-start gap-3 max-w-md">
                        <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-[13px] font-bold shrink-0">
                            RS
                        </div>
                        <div>
                            <p className="text-[13px] text-slate-400 leading-relaxed italic">
                                &ldquo;{locale === 'id'
                                    ? 'BikinPOS bikin operasional 3 toko saya jadi jauh lebih rapi. Dashboard-nya premium banget!'
                                    : 'BikinPOS made managing my 3 stores so much easier. The dashboard is truly premium!'}&rdquo;
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[12px] font-semibold text-slate-300">Rina Setiawati</span>
                                <span className="text-[10px] text-slate-600">·</span>
                                <span className="text-[10px] text-slate-500">Toko Berkah</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ Right Panel — Login Form ═══ */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0D1117] transition-colors duration-300">
                <div className="w-full max-w-sm">
                    {/* Logo — mobile */}
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group lg:hidden">
                        <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Store size={20} className="text-white" />
                        </div>
                        <span className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
                            Bikin<span className="text-primary-500">POS</span>
                        </span>
                    </Link>

                    {/* Logo — desktop (large) */}
                    <div className="hidden lg:flex items-center gap-3 mb-10">
                        <div className="w-11 h-11 bg-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/15">
                            <Store size={24} className="text-white" />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-[-0.03em]">
                                Bikin<span className="text-primary-500">POS</span>
                            </span>
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">{t('login.welcomeBack')}</h1>
                    <p className="text-sm text-slate-500 mt-1 mb-8">{t('login.subtitle')}</p>

                    {searchParams.get('demo') === 'true' && (
                        <div className="mb-6 px-4 py-3 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-xl flex items-start gap-2.5">
                            <Zap size={16} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">{t('login.demoMode')}</p>
                                <p className="text-[11px] text-primary-600 dark:text-primary-400 mt-0.5">{t('login.demoText')}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-xs font-medium text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {searchParams.get('expired') === 'true' && !error && (
                        <div className="mb-5 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400">
                            {locale === 'id' ? 'Sesi Anda telah berakhir. Silakan masuk kembali.' : 'Your session has expired. Please log in again.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email — labeled input (Stripe-style) */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                                {t('login.email')}
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full h-11 px-0 bg-transparent border-0 border-b-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
                                style={{
                                    borderBottomColor:
                                        focusedField === 'email'
                                            ? '#0D5C63'
                                            : formData.email
                                                ? '#CBD5E1'
                                                : '#E2E8F0',
                                }}
                                placeholder={locale === 'id' ? 'nama@email.com' : 'name@email.com'}
                                required
                            />
                        </div>

                        {/* Password — labeled input */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-[13px] font-medium text-slate-700 dark:text-slate-300 mb-1.5"
                            >
                                {t('login.password')}
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                className="w-full h-11 px-0 bg-transparent border-0 border-b-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none transition-colors"
                                style={{
                                    borderBottomColor:
                                        focusedField === 'password'
                                            ? '#0D5C63'
                                            : formData.password
                                                ? '#CBD5E1'
                                                : '#E2E8F0',
                                }}
                                placeholder="············"
                                required
                            />
                            {/* Forgot password link */}
                            <div className="flex justify-end mt-1.5">
                                <button
                                    type="button"
                                    className="text-[12px] font-medium text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                >
                                    {locale === 'id' ? 'Lupa password?' : 'Forgot password?'}
                                </button>
                            </div>
                        </div>

                        {/* Submit button — larger (h-12) with spinner */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-primary-500 text-white text-[15px] font-semibold rounded-xl hover:bg-primary-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-md shadow-primary-500/15"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2.5">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {t('login.authenticating')}
                                </span>
                            ) : (
                                <>
                                    {t('login.signIn')}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-[13px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            {t('login.backToHome')}
                        </Link>
                    </div>

                    <p className="text-center mt-6 text-[11px] text-slate-400 dark:text-slate-500">
                        {t('login.poweredBy')}{' '}
                        <Link to="/about" className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            bikinsite
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
