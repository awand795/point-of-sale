import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState, useEffect } from 'react';
import {
    Store,
    ShoppingCart,
    Package,
    BarChart3,
    ShieldCheck,
    Zap,
    ArrowRight,
    ChevronRight,
    MonitorSmartphone,
    Sparkles,
    CheckCircle2,
    TrendingUp,
    Search,
} from 'lucide-react';

// ─── Inline Marquee Styles ───
const marqueeStyles = `
@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
.marquee-track {
    animation: marquee 35s linear infinite;
}
.marquee-track:hover {
    animation-play-state: paused;
}
.mask-edges {
    -webkit-mask: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
    mask: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
}
`;

const storeLogos = [
    'Toko Berkah', 'Warung Mbak Sari', 'Sinar Jaya Mart',
    'Tiga Putra Store', 'Aneka Rasa Mart', 'Prima Fresh',
    'Bumi Indah Shop', 'Maju Bersama', 'Toko Berkah',
    'Warung Mbak Sari', 'Sinar Jaya Mart', 'Tiga Putra Store',
    'Aneka Rasa Mart', 'Prima Fresh', 'Bumi Indah Shop',
    'Maju Bersama',
];

// ─── Main Landing ───
const Landing = () => {
    const { t, locale, toggleLanguage } = useLanguage();
    const features = t('features.items');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-surface text-slate-900 dark:text-white overflow-x-hidden font-['Geist',system-ui,sans-serif]">

            {/* ═══ Marquee Styles ═══ */}
            <style>{marqueeStyles}</style>

            {/* ═══ Navigation — Floating Pill Island ═══ */}
            <nav
                className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
                    scrolled ? 'shadow-xl shadow-slate-900/8' : ''
                }`}
            >
                <div
                    className={`flex items-center gap-1 px-1.5 py-1.5 transition-all duration-500 ${
                        scrolled
                            ? 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] shadow-sm'
                            : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/30 dark:border-white/[0.05]'
                    } rounded-2xl`}
                >
                    {/* Logo */}
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-3 py-1.5 group"
                    >
                        <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Store size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-[15px] tracking-[-0.03em]">
                            Bikin<span className="text-primary-500">POS</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center gap-0.5 ml-1">
                        {[
                            { href: '#features', label: t('nav.features') },
                            { href: '/pricing', label: t('nav.pricing'), isLink: true },
                            { href: '/about', label: t('nav.about'), isLink: true },
                        ].map((item) => {
                            const cls =
                                'px-3.5 py-1.5 text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all';
                            return item.isLink ? (
                                <Link key={item.label} to={item.href} className={cls}>
                                    {item.label}
                                </Link>
                            ) : (
                                <a key={item.label} href={item.href} className={cls}>
                                    {item.label}
                                </a>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-1.5 ml-1">
                        <Link
                            to="/login"
                            className="hidden sm:block px-3.5 py-1.5 text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                        >
                            {t('nav.signIn')}
                        </Link>
                        <Link
                            to="/login?demo=true"
                            className="px-4 py-1.5 bg-primary-500 text-white text-[14px] font-semibold rounded-xl hover:bg-primary-600 transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                        >
                            {t('nav.tryDemo')} <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ Hero — Asymmetric Editorial ═══ */}
            <section className="relative pt-32 pb-20 md:pb-28 px-6 overflow-hidden min-h-[90vh] flex items-center">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/40 dark:from-primary-500/[0.02] via-transparent to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto w-full relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* ── Left: Typographic Statement ── */}
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-full mb-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                            <span className="text-[13px] font-medium text-primary-700 dark:text-primary-300">
                                {t('hero.badge')}
                            </span>
                        </div>

                        <h1 className="text-[56px] md:text-[72px] lg:text-[86px] font-bold tracking-[-0.04em] leading-[0.92] text-slate-900 dark:text-white mb-5">
                            <span className="text-primary-500">{t('hero.title1')}</span>
                            <br />
                            <span>{t('hero.title2')}</span>
                        </h1>

                        <p className="text-[15px] md:text-[16px] text-slate-500 dark:text-slate-400 leading-[1.75] max-w-lg mb-8">
                            {t('hero.subtitle')}
                        </p>

                        <div className="flex flex-col sm:flex-row items-start gap-3">
                            <Link
                                to="/login?demo=true"
                                className="group w-full sm:w-auto px-6 py-3.5 bg-[#FF6B35] text-white text-[15px] font-semibold rounded-xl hover:bg-[#E55A2B] transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25"
                            >
                                <Zap size={16} />
                                {t('hero.launchDemo')}
                            </Link>
                            <Link
                                to="/login"
                                className="group w-full sm:w-auto px-6 py-3.5 bg-transparent border border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-300 text-[15px] font-medium rounded-xl hover:border-slate-300 dark:hover:border-white/[0.2] hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                            >
                                <MonitorSmartphone size={16} />
                                {t('nav.signIn')}
                            </Link>
                        </div>
                    </div>

                    {/* ── Right: POS Interface Mockup ── */}
                    <div className="relative z-10">
                        {/* Floating badge */}
                        <div className="absolute -top-3 -right-2 z-20 px-3 py-1.5 bg-[#FF6B35] text-white text-[13px] font-bold rounded-lg shadow-lg shadow-[#FF6B35]/25 rotate-[6deg]">
                            Live Demo
                        </div>

                        {/* Mockup card */}
                        <div className="relative bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xl shadow-slate-900/10 dark:shadow-black/30 overflow-hidden">
                            {/* Top bar */}
                            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-slate-900/60">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-primary-500 rounded-md flex items-center justify-center">
                                        <Store size={12} className="text-white" />
                                    </div>
                                    <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-300">
                                        BikinPOS
                                    </span>
                                </div>
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                    <Search size={13} className="text-slate-400" />
                                    <span className="text-[13px] text-slate-400">Cari produk...</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-primary-50 dark:bg-primary-500/10 rounded-lg">
                                    <ShoppingCart size={13} className="text-primary-500" />
                                    <span className="text-[13px] font-bold text-primary-600 dark:text-primary-400">
                                        3
                                    </span>
                                </div>
                            </div>

                            {/* Main area */}
                            <div className="flex min-h-[300px] lg:min-h-[340px]">
                                {/* Category sidebar */}
                                <div className="w-[72px] md:w-[88px] flex-shrink-0 border-r border-slate-100 dark:border-white/[0.06] p-2 space-y-1">
                                    {['Semua', 'Makanan', 'Minuman', 'Snack', 'Rokok'].map((cat, i) => (
                                        <div
                                            key={cat}
                                            className={`px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                                                i === 0
                                                    ? 'bg-primary-500 text-white'
                                                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.03]'
                                            }`}
                                        >
                                            {cat.slice(0, 4)}
                                        </div>
                                    ))}
                                </div>

                                {/* Product grid */}
                                <div className="flex-1 p-2.5 md:p-3">
                                    <div className="grid grid-cols-2 gap-1.5 md:gap-2">
                                        {[
                                            { name: 'Nasi Goreng', price: '15.000', sold: 89 },
                                            { name: 'Mie Ayam', price: '12.000', sold: 64 },
                                            { name: 'Es Teh Manis', price: '5.000', sold: 120 },
                                            { name: 'Kopi Susu', price: '8.000', sold: 45 },
                                            { name: 'Pisang Goreng', price: '7.000', sold: 73 },
                                            { name: 'Air Mineral', price: '3.000', sold: 200 },
                                        ].map((p) => (
                                            <div
                                                key={p.name}
                                                className="px-2.5 md:px-3 py-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-white/[0.04] hover:border-primary-200 dark:hover:border-primary-500/30 cursor-pointer transition-all"
                                            >
                                                <div className="flex items-center gap-1.5 md:gap-2 mb-1">
                                                    <div className="w-6 h-6 rounded-md bg-primary-100 dark:bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                                        <Package size={12} className="text-primary-600 dark:text-primary-400" />
                                                    </div>
                                                    <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                        {p.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[13px] font-bold text-primary-600 dark:text-primary-400">
                                                        Rp{p.price}
                                                    </span>
                                                    <span className="text-[13px] text-slate-400">{p.sold} terjual</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Cart panel */}
                                <div className="w-32 md:w-40 flex-shrink-0 border-l border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-slate-900/50 flex flex-col">
                                    <div className="px-3 py-2.5 border-b border-slate-100 dark:border-white/[0.06]">
                                        <span className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Pesanan
                                        </span>
                                    </div>
                                    <div className="flex-1 p-2.5 md:p-3 space-y-2">
                                        {[
                                            { name: 'Nasi Goreng', qty: 2, price: '30.000' },
                                            { name: 'Es Teh', qty: 1, price: '5.000' },
                                            { name: 'Pisgor', qty: 1, price: '7.000' },
                                        ].map((item) => (
                                            <div
                                                key={item.name}
                                                className="pb-2 border-b border-slate-100 dark:border-white/[0.04] last:border-0"
                                            >
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className="text-[13px] font-medium text-slate-700 dark:text-slate-300 truncate">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">
                                                        ×{item.qty}
                                                    </span>
                                                </div>
                                                <span className="text-[13px] text-primary-600 dark:text-primary-400 font-medium">
                                                    Rp{item.price}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="px-3 py-2.5 border-t border-slate-100 dark:border-white/[0.06] space-y-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[13px] text-slate-500">Total</span>
                                            <span className="text-[15px] font-bold text-primary-600 dark:text-primary-400">
                                                Rp42.000
                                            </span>
                                        </div>
                                        <div className="px-3 py-2 bg-[#FF6B35] text-white text-[13px] font-bold rounded-lg text-center cursor-pointer hover:bg-[#E55A2B] transition-colors">
                                            Bayar
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative dots */}
                        <div className="absolute -bottom-3 -left-3 pointer-events-none opacity-30">
                            <div className="grid grid-cols-4 gap-1.5">
                                {Array.from({ length: 16 }).map((_, i) => (
                                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Social Proof — Logo Marquee ═══ */}
            <section className="py-10 md:py-12 border-y border-slate-100 dark:border-white/[0.06] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-[13px] font-semibold text-slate-400 dark:text-slate-500 mb-5 uppercase tracking-[0.08em]">
                        Dipercaya oleh 500+ toko aktif di Indonesia
                    </p>
                    <div className="relative overflow-hidden mask-edges">
                        <div className="flex marquee-track gap-14 md:gap-20 w-max">
                            {storeLogos.map((name, i) => (
                                <div
                                    key={i}
                                    className="flex items-center gap-3 text-slate-300 dark:text-slate-600"
                                >
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center">
                                        <Store size={16} className="text-slate-400 dark:text-slate-500" />
                                    </div>
                                    <span className="text-[15px] font-bold tracking-[-0.02em] whitespace-nowrap">
                                        {name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ Features — Editorial Bento Grid ═══ */}
            <section id="features" className="py-24 md:py-28 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section heading */}
                    <div className="max-w-xl mb-16">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-full mb-4">
                            <Sparkles size={14} className="text-primary-600 dark:text-primary-400" />
                            <span className="text-[13px] font-medium text-primary-700 dark:text-primary-300">
                                {t('features.title')}
                            </span>
                        </div>
                        <h2 className="text-[32px] md:text-[40px] font-bold tracking-[-0.03em] leading-[1.1] text-slate-900 dark:text-white mb-3">
                            {t('features.subtitle')}
                        </h2>
                        <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {locale === 'id'
                                ? 'Platform all-in-one untuk kelola penjualan, stok, dan pelanggan.'
                                : 'All-in-one platform to manage sales, inventory, and customers.'}
                        </p>
                    </div>

                    {/* Bento grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                        {/* ── Large Card 1 — Smart POS Terminal ── */}
                        <div className="md:col-span-2 row-span-1 bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-6 md:p-8 overflow-hidden relative group hover:shadow-md transition-all duration-300">
                            <div className="relative z-10 max-w-sm">
                                <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center mb-4 text-[#FF6B35]">
                                    <ShoppingCart size={20} />
                                </div>
                                <h3 className="text-[20px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white mb-2">
                                    {features[0]?.title}
                                </h3>
                                <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {features[0]?.desc}
                                </p>
                            </div>
                            {/* SVG Terminal illustration */}
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 opacity-[0.08] dark:opacity-[0.06] pointer-events-none">
                                <svg viewBox="0 0 200 200" fill="none">
                                    <rect
                                        x="20"
                                        y="20"
                                        width="160"
                                        height="130"
                                        rx="8"
                                        stroke="#0D5C63"
                                        strokeWidth="2"
                                    />
                                    <rect
                                        x="30"
                                        y="55"
                                        width="60"
                                        height="20"
                                        rx="4"
                                        stroke="#0D5C63"
                                        strokeWidth="1.5"
                                    />
                                    <rect
                                        x="30"
                                        y="85"
                                        width="60"
                                        height="20"
                                        rx="4"
                                        stroke="#0D5C63"
                                        strokeWidth="1.5"
                                    />
                                    <rect
                                        x="30"
                                        y="115"
                                        width="60"
                                        height="20"
                                        rx="4"
                                        stroke="#0D5C63"
                                        strokeWidth="1.5"
                                    />
                                    <rect
                                        x="105"
                                        y="55"
                                        width="60"
                                        height="55"
                                        rx="4"
                                        stroke="#0D5C63"
                                        strokeWidth="1.5"
                                    />
                                    <line x1="20" y1="45" x2="180" y2="45" stroke="#0D5C63" strokeWidth="1" />
                                    <circle cx="35" cy="35" r="4" fill="#0D5C63" />
                                    <circle cx="47" cy="35" r="4" fill="#0D5C63" fillOpacity="0.5" />
                                    <circle cx="59" cy="35" r="4" fill="#0D5C63" fillOpacity="0.3" />
                                </svg>
                            </div>
                        </div>

                        {/* ── Small Card 1 — Inventory ── */}
                        <div className="bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-3 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                                <Package size={18} />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white mb-1.5">
                                {features[1]?.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {features[1]?.desc}
                            </p>
                        </div>

                        {/* ── Small Card 2 — Analytics ── */}
                        <div className="bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-3 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                                <BarChart3 size={18} />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white mb-1.5">
                                {features[2]?.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {features[2]?.desc}
                            </p>
                        </div>

                        {/* ── Small Card 3 — Secure ── */}
                        <div className="bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-3 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                                <ShieldCheck size={18} />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white mb-1.5">
                                {features[3]?.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {features[3]?.desc}
                            </p>
                        </div>

                        {/* ── Large Card 2 — Performance ── */}
                        <div className="md:col-span-2 row-span-1 bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-6 md:p-8 overflow-hidden relative group hover:shadow-md transition-all duration-300">
                            <div className="relative z-10 max-w-sm">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                    <TrendingUp size={20} />
                                </div>
                                <h3 className="text-[20px] font-bold tracking-[-0.02em] text-slate-900 dark:text-white mb-2">
                                    {features[4]?.title}
                                </h3>
                                <p className="text-[14px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {features[4]?.desc}
                                </p>
                            </div>
                            {/* SVG Chart illustration */}
                            <div className="absolute -bottom-6 -right-6 w-48 h-48 opacity-[0.08] dark:opacity-[0.06] pointer-events-none">
                                <svg viewBox="0 0 200 200" fill="none">
                                    <rect
                                        x="20"
                                        y="50"
                                        width="160"
                                        height="120"
                                        rx="8"
                                        stroke="#0D5C63"
                                        strokeWidth="2"
                                    />
                                    <polyline
                                        points="30,140 55,120 80,90 105,100 130,60 155,75 170,50"
                                        stroke="#0D5C63"
                                        strokeWidth="2.5"
                                        fill="none"
                                    />
                                    <circle cx="80" cy="90" r="3" fill="#0D5C63" />
                                    <circle cx="130" cy="60" r="3" fill="#0D5C63" />
                                    <circle cx="170" cy="50" r="3" fill="#0D5C63" />
                                    <line
                                        x1="30"
                                        y1="155"
                                        x2="170"
                                        y2="155"
                                        stroke="#0D5C63"
                                        strokeWidth="0.5"
                                        strokeDasharray="4,4"
                                    />
                                    <rect x="30" y="50" width="8" height="20" rx="2" fill="#0D5C63" fillOpacity="0.3" />
                                    <rect x="45" y="50" width="8" height="35" rx="2" fill="#0D5C63" fillOpacity="0.5" />
                                    <rect x="60" y="50" width="8" height="50" rx="2" fill="#0D5C63" fillOpacity="0.7" />
                                </svg>
                            </div>
                        </div>

                        {/* ── Small Card 4 — Cross-Platform ── */}
                        <div className="bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-2xl p-5 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                            <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-3 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform">
                                <MonitorSmartphone size={18} />
                            </div>
                            <h3 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white mb-1.5">
                                {features[5]?.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                                {features[5]?.desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══ CTA Section — Dark with Massive Typographic Texture ═══ */}
            <section className="relative py-24 md:py-28 px-6 overflow-hidden bg-slate-900 dark:bg-slate-950">
                {/* Large transparent brand text as background texture */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <span className="text-[clamp(6rem,25vw,20rem)] font-black tracking-[-0.06em] text-white/[0.03] dark:text-white/[0.02] leading-none">
                        POS
                    </span>
                </div>

                <div className="max-w-3xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.06] border border-white/[0.08] rounded-full mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                        <span className="text-[13px] font-medium text-slate-400">
                            {locale === 'id' ? '#1 POS untuk Retail Indonesia' : '#1 POS for Indonesian Retail'}
                        </span>
                    </div>

                    <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.05] text-white mb-4">
                        {locale === 'id' ? 'Mulai hari ini. Gratis.' : 'Start today. Free.'}
                    </h2>
                    <p className="text-[15px] md:text-[16px] text-slate-400 leading-relaxed max-w-lg mx-auto mb-10">
                        {locale === 'id'
                            ? 'Tidak perlu kartu kredit. Setup dalam 5 menit. Kelola bisnis Anda dengan lebih baik.'
                            : 'No credit card required. 5-minute setup. Manage your business better.'}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link
                            to="/login?demo=true"
                            className="group w-full sm:w-auto px-8 py-3.5 bg-[#FF6B35] text-white text-[15px] font-semibold rounded-xl hover:bg-[#E55A2B] transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-[#FF6B35]/25"
                        >
                            <Zap size={16} />
                            {t('hero.launchDemo')}
                        </Link>
                        <Link
                            to="/pricing"
                            className="group w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white text-[15px] font-medium rounded-xl hover:bg-white/10 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                        >
                            {t('nav.pricing')}{' '}
                            <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-[13px] text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-400" /> No credit card
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-400" /> 5 menit setup
                        </span>
                        <span className="flex items-center gap-1.5">
                            <CheckCircle2 size={15} className="text-emerald-400" /> Gratis selamanya
                        </span>
                    </div>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="bg-surface border-t border-slate-200 dark:border-white/[0.06] py-12 md:py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-7 h-7 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Store size={16} className="text-white" />
                            </div>
                            <span className="font-bold text-[15px] tracking-[-0.03em]">
                                Bikin<span className="text-primary-500">POS</span>
                            </span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <button
                                onClick={toggleLanguage}
                                className="text-[14px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {locale === 'id' ? 'English' : 'Indonesia'}
                            </button>
                            <a
                                href="#"
                                className="text-[14px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {t('footer.privacy')}
                            </a>
                            <a
                                href="#"
                                className="text-[14px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                {t('footer.terms')}
                            </a>
                        </div>

                        <p className="text-[14px] text-slate-400">
                            {t('footer.createdBy')}{' '}
                            <Link
                                to="/about"
                                className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                bikinsite
                            </Link>
                        </p>
                    </div>
                    <p className="text-center mt-8 text-[13px] text-slate-300 dark:text-slate-600">
                        {t('footer.rights')}
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
