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
    Languages,
    Sparkles,
    CheckCircle2,
} from 'lucide-react';

// ─── Feature Card ───
const FeatureCard = ({ icon, title, desc, delay }) => (
    <div
        className="group bg-surface dark:bg-surface-raised border border-slate-200/60 dark:border-white/[0.06] rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400 group-hover:scale-105 transition-transform duration-300">
            {icon}
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</p>
    </div>
);

// ─── Main Landing ───
const Landing = () => {
    const { t, locale, toggleLanguage } = useLanguage();
    const features = t('features.items');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="min-h-screen bg-surface text-slate-900 dark:text-white overflow-x-hidden">

            {/* ═══ Navigation ═══ */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-surface/80 backdrop-blur-md border-b border-slate-200/60 dark:border-white/[0.06]' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Store size={18} className="text-white" />
                        </div>
                        <span className="font-semibold text-base tracking-tight">Bikin<span className="text-primary-500">POS</span></span>
                    </Link>

                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <a href="#features" className="hover:text-slate-800 dark:hover:text-white transition-colors">{t('nav.features')}</a>
                        <Link to="/pricing" className="hover:text-slate-800 dark:hover:text-white transition-colors">{t('nav.pricing')}</Link>
                        <Link to="/about" className="hover:text-slate-800 dark:hover:text-white transition-colors">{t('nav.about')}</Link>
                        <Link to="/login" className="hover:text-slate-800 dark:hover:text-white transition-colors">{t('nav.signIn')}</Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={toggleLanguage} className="w-8 h-8 rounded-lg bg-transparent border border-slate-200 dark:border-white/[0.12] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/[0.2] transition-all">
                            <Languages size={16} />
                        </button>
                        <Link to="/login?demo=true" className="px-5 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all active:scale-95 flex items-center gap-2 shadow-sm">
                            {t('nav.tryDemo')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ Hero Section ═══ */}
            <header className="relative pt-28 pb-24 px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto text-center relative">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] rounded-full mb-8">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('hero.badge')}</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.05] mb-6">
                        <span className="text-primary-500">{t('hero.title1')}</span>
                        <br />
                        <span>{t('hero.title2')}</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10">
                        {t('hero.subtitle')}
                    </p>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/login?demo=true" className="group w-full sm:w-auto px-8 py-3.5 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm">
                            <Zap size={16} />
                            {t('hero.launchDemo')}
                        </Link>
                        <Link to="/login" className="group w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:border-slate-300 dark:hover:border-white/[0.2] transition-all active:scale-[0.97] flex items-center justify-center gap-2">
                            <MonitorSmartphone size={16} />
                            {t('nav.signIn')}
                        </Link>
                    </div>

                    {/* Hero visual: Dashboard preview cards */}
                    <div className="mt-16 max-w-4xl mx-auto">
                        <div className="grid grid-cols-3 gap-4 text-left">
                            <div className="bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-sm">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Today Revenue</p>
                                <p className="text-xl font-semibold text-slate-900 dark:text-white">Rp 2,450,000</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">+12.5%</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">vs yesterday</span>
                                </div>
                            </div>
                            <div className="bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-sm">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Transactions</p>
                                <p className="text-xl font-semibold text-slate-900 dark:text-white">48</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">+8.3%</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">vs yesterday</span>
                                </div>
                            </div>
                            <div className="bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.08] rounded-xl p-5 shadow-sm">
                                <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Items Sold</p>
                                <p className="text-xl font-semibold text-slate-900 dark:text-white">156</p>
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">+15.2%</span>
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500">vs yesterday</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══ Social Proof Strip ═══ */}
            <section className="py-8 px-6 bg-slate-50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-white/[0.06]">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        <span className="font-medium text-slate-600 dark:text-slate-300">Dipercaya 500+ toko aktif di Indonesia</span>
                        <span className="mx-3 text-slate-300 dark:text-slate-600">·</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Rata-rata setup 5 menit</span>
                        <span className="mx-3 text-slate-300 dark:text-slate-600">·</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Dukungan Bahasa Indonesia</span>
                        <span className="mx-3 text-slate-300 dark:text-slate-600">·</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">Rp 0 biaya setup</span>
                    </p>
                </div>
            </section>

            {/* ═══ Features Section ═══ */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-full mb-4">
                            <Sparkles size={14} className="text-primary-600 dark:text-primary-400" />
                            <span className="text-[11px] font-medium text-primary-700 dark:text-primary-300">{t('features.title')}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">{t('features.subtitle')}</h2>
                        <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto">Everything you need to run a modern retail business</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            { icon: <ShoppingCart size={20} />, title: features[0]?.title, desc: features[0]?.desc, delay: 0 },
                            { icon: <Package size={20} />, title: features[1]?.title, desc: features[1]?.desc, delay: 80 },
                            { icon: <BarChart3 size={20} />, title: features[2]?.title, desc: features[2]?.desc, delay: 160 },
                            { icon: <ShieldCheck size={20} />, title: features[3]?.title, desc: features[3]?.desc, delay: 240 },
                            { icon: <Zap size={20} />, title: features[4]?.title, desc: features[4]?.desc, delay: 320 },
                            { icon: <MonitorSmartphone size={20} />, title: features[5]?.title, desc: features[5]?.desc, delay: 400 },
                        ].map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA Section ═══ */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-slate-900 dark:bg-slate-950" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <div className="max-w-3xl mx-auto text-center relative">
                    <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4 leading-tight">
                        {locale === 'id' ? 'Mulai hari ini. Gratis.' : 'Start today. Free.'}
                    </h2>
                    <p className="text-base md:text-lg text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                        {locale === 'id'
                            ? 'Tidak perlu kartu kredit. Setup dalam 5 menit. Kelola bisnis Anda dengan lebih baik.'
                            : 'No credit card required. 5-minute setup. Manage your business better.'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link to="/login?demo=true" className="group w-full sm:w-auto px-8 py-3.5 bg-white text-slate-900 text-sm font-medium rounded-lg hover:bg-slate-100 transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-sm">
                            <Zap size={16} className="text-primary-500" />
                            {t('hero.launchDemo')}
                        </Link>
                        <Link to="/pricing" className="group w-full sm:w-auto px-8 py-3.5 bg-transparent border border-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all active:scale-[0.97] flex items-center justify-center gap-2">
                            {t('nav.pricing')} <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> No credit card</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> 5 menit setup</span>
                        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-400" /> Gratis selamanya</span>
                    </div>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="bg-surface border-t border-slate-200 dark:border-white/[0.06] py-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-7 h-7 bg-slate-800 dark:bg-white/10 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <Store size={16} className="text-white" />
                            </div>
                            <span className="font-semibold text-sm tracking-tight">Bikin<span className="text-primary-500">POS</span></span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <button onClick={toggleLanguage} className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                                {locale === 'id' ? 'English' : 'Indonesia'}
                            </button>
                            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t('footer.privacy')}</a>
                            <a href="#" className="text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">{t('footer.terms')}</a>
                        </div>

                        <p className="text-xs text-slate-400">
                            {t('footer.createdBy')}{' '}
                            <Link to="/about" className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">bikinsite</Link>
                        </p>
                    </div>
                    <p className="text-center mt-8 text-[10px] text-slate-300 dark:text-slate-600">{t('footer.rights')}</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
