import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useState, useEffect, useRef } from 'react';
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
    Globe,
    Languages,
    Star,
    TrendingUp,
    Clock,
    Users,
    Sparkles,
    Fingerprint,
    HeadphonesIcon,
    ArrowUpRight,
    CheckCircle2
} from 'lucide-react';

// ─── Animated Counter ───────────────────────────────────────
const Counter = ({ end, suffix = '', duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const increment = end / (duration / 16);
                    const timer = setInterval(() => {
                        start += increment;
                        if (start >= end) {
                            setCount(end);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 16);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// ─── Floating Orbs ──────────────────────────────────────────
const FloatingOrbs = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-violet-200/30 to-fuchsia-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-gradient-to-tr from-amber-200/20 to-rose-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-primary-100/30 rounded-full blur-[80px] animate-pulse" style={{ animationDuration: '6s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    </div>
);

// ─── Feature Card ───────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, gradient, delay }) => (
    <div
        className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:bg-white/90"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${gradient} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
            <div className="text-white">{icon}</div>
        </div>
        <h4 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{title}</h4>
        <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
        <div className="absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r from-transparent via-primary-200 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
);

// ─── Testimonial ────────────────────────────────────────────
const Testimonials = ({ t }) => {
    const testimonials = [
        { name: 'Sarah Chen', role: 'Retail Owner', avatar: 'SC', text: 'LuxePOS transformed our checkout process. Revenue increased 40% in the first month.', rating: 5 },
        { name: 'Marcus Rivera', role: 'Restaurant Manager', avatar: 'MR', text: 'The inventory tracking is a game-changer. We reduced waste by 60%.', rating: 5 },
        { name: 'Aisha Patel', role: 'E-commerce Director', avatar: 'AP', text: 'Beautiful interface, powerful analytics. Best POS investment we have made.', rating: 5 },
    ];

    return (
        <section className="py-32 px-6 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-6">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Trusted by 2,000+ businesses</span>
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Loved by teams everywhere</h2>
                    <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">See what our customers say about their experience</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <div key={idx} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: item.rating }).map((_, i) => (
                                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                                ))}
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed mb-6 italic">"{item.text}"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg">
                                    {item.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{item.name}</p>
                                    <p className="text-xs text-slate-400 font-medium">{item.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ─── Main Landing ───────────────────────────────────────────
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
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

            {/* ═══ Navigation ═══ */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 rotate-3 group-hover:rotate-6 transition-transform duration-300">
                            <Store size={22} className="text-white -rotate-3" />
                        </div>
                        <h1 className="font-black text-xl tracking-tighter">LUXE<span className="text-primary-500">POS</span></h1>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                        <a href="#features" className="hover:text-primary-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full">{t('nav.features')}</a>
                        <Link to="/pricing" className="hover:text-primary-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full">{t('nav.pricing')}</Link>
                        <Link to="/about" className="hover:text-primary-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary-500 after:transition-all hover:after:w-full">{t('nav.about')}</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button onClick={toggleLanguage}
                            className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all relative group">
                            <Languages size={18} />
                            <span className="absolute mt-14 text-[8px] font-black uppercase tracking-widest text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {locale === 'id' ? 'EN' : 'ID'}
                            </span>
                        </button>
                        <Link to="/login" className="hidden sm:inline text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">{t('nav.signIn')}</Link>
                        <Link to="/login?demo=true"
                            className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-violet-600 text-white text-sm font-bold rounded-2xl hover:shadow-xl hover:shadow-primary-200 transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary-100">
                            {t('nav.tryDemo')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ═══ Hero Section ═══ */}
            <header className="relative min-h-screen flex items-center pt-20 pb-32 px-6 overflow-hidden">
                <FloatingOrbs />

                <div className="max-w-6xl mx-auto text-center relative">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md border border-slate-200 rounded-full mb-10 shadow-lg animate-fadeIn">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500" />
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-600">{t('hero.badge')}</span>
                        <Sparkles size={14} className="text-amber-500" />
                    </div>

                    {/* Title */}
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85] mb-8">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-violet-600 to-fuchsia-600">{t('hero.title1')}</span>
                        <br />
                        <span>{t('hero.title2')}</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12">
                        {t('hero.subtitle')}
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login?demo=true"
                            className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-primary-600 to-violet-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:shadow-2xl hover:shadow-primary-200/50 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97]">
                            <Zap size={18} className="group-hover:rotate-12 transition-transform" />
                            {t('hero.launchDemo')}
                        </Link>
                        <button className="group w-full sm:w-auto px-10 py-5 bg-white/80 backdrop-blur-sm border-2 border-slate-200 text-slate-800 font-black uppercase tracking-widest text-sm rounded-2xl hover:border-slate-300 hover:bg-white transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97]">
                            <MonitorSmartphone size={18} className="group-hover:scale-110 transition-transform" />
                            {t('hero.watchPreview')}
                        </button>
                    </div>

                    {/* Preview Image */}
                    <div className="mt-24 relative group max-w-5xl mx-auto">
                        <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 via-violet-600 to-fuchsia-600 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-30 transition duration-1000" />
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl overflow-hidden ring-1 ring-white/10">
                            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-[1.8rem] overflow-hidden relative">
                                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000"
                                    alt="POS Dashboard Preview"
                                    className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform duration-1000" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                                {/* Play button */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:bg-white/20 transition-all duration-500 shadow-2xl">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 ml-1">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </div>
                                </div>
                                {/* Bottom gradient glow */}
                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900/80 to-transparent" />
                            </div>
                        </div>
                    </div>

                    {/* Floating stat badges */}
                    <div className="hidden lg:block absolute top-1/4 -left-12 animate-bounce-slow" style={{ animationDuration: '6s' }}>
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-slate-200">
                            <p className="text-2xl font-black text-slate-900">12K+</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transactions</p>
                        </div>
                    </div>
                    <div className="hidden lg:block absolute bottom-1/3 -right-12 animate-bounce-slow" style={{ animationDuration: '8s' }}>
                        <div className="bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-xl border border-slate-200">
                            <p className="text-2xl font-black text-slate-900">98%</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Uptime</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* ═══ Stats Section ═══ */}
            <section className="py-20 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 75% 50%, #6d28d9 0%, transparent 50%)' }} />
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16">
                        {[
                            { icon: <TrendingUp size={24} />, end: 12000, suffix: '+', label: 'Transactions Processed' },
                            { icon: <Users size={24} />, end: 2000, suffix: '+', label: 'Active Businesses' },
                            { icon: <Clock size={24} />, end: 99.9, suffix: '%', label: 'Uptime Guarantee' },
                            { icon: <ShieldCheck size={24} />, end: 50000, suffix: '+', label: 'Hours Saved' },
                        ].map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary-300">
                                    {stat.icon}
                                </div>
                                <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                    <Counter end={stat.end} suffix={stat.suffix} />
                                </p>
                                <p className="text-sm text-slate-400 font-medium mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Features Section ═══ */}
            <section id="features" className="py-32 px-6 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white pointer-events-none" />
                <div className="max-w-7xl mx-auto relative">
                    <div className="text-center mb-20">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 border border-primary-100 rounded-full mb-6">
                            <Sparkles size={14} className="text-primary-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-700">{t('features.title')}</span>
                        </span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{t('features.subtitle')}</h2>
                        <p className="mt-4 text-lg text-slate-500 font-medium max-w-2xl mx-auto">Everything you need to run a modern retail business</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {[
                            { icon: <ShoppingCart size={24} />, title: features[0]?.title, desc: features[0]?.desc, gradient: 'from-primary-500 to-violet-600', delay: 0 },
                            { icon: <Package size={24} />, title: features[1]?.title, desc: features[1]?.desc, gradient: 'from-emerald-500 to-teal-600', delay: 100 },
                            { icon: <BarChart3 size={24} />, title: features[2]?.title, desc: features[2]?.desc, gradient: 'from-amber-500 to-orange-600', delay: 200 },
                            { icon: <Fingerprint size={24} />, title: features[3]?.title, desc: features[3]?.desc, gradient: 'from-rose-500 to-pink-600', delay: 300 },
                            { icon: <Zap size={24} />, title: features[4]?.title, desc: features[4]?.desc, gradient: 'from-blue-500 to-cyan-600', delay: 400 },
                            { icon: <Globe size={24} />, title: features[5]?.title, desc: features[5]?.desc, gradient: 'from-slate-600 to-slate-800', delay: 500 },
                        ].map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ Testimonials ═══ */}
            <Testimonials t={t} />

            {/* ═══ CTA Section ═══ */}
            <section className="relative py-32 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-600/20 to-violet-600/20 rounded-full blur-[150px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)', backgroundSize: '30px 30px' }} />

                <div className="max-w-4xl mx-auto text-center relative">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full mb-8">
                        <Sparkles size={14} className="text-amber-400" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">Limited Time Offer</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                        {locale === 'id' ? 'Siap Memodernisasi\nBisnis Anda?' : "Ready to Modernize\nYour Business?"}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                        {locale === 'id'
                            ? 'Mulai hari ini dan rasakan kemudahan mengelola bisnis dengan LuxePOS. Gratis untuk dicoba!'
                            : 'Start today and experience the ease of managing your business with LuxePOS. Free to try!'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/login?demo=true"
                            className="group w-full sm:w-auto px-10 py-5 bg-white text-slate-900 font-black uppercase tracking-widest text-sm rounded-2xl hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97]">
                            <Zap size={18} className="text-primary-600 group-hover:rotate-12 transition-transform" />
                            {t('hero.launchDemo')}
                        </Link>
                        <Link to="/pricing"
                            className="group w-full sm:w-auto px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.97]">
                            {t('nav.pricing')} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> No credit card</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> 14-day free trial</span>
                        <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-400" /> Cancel anytime</span>
                    </div>
                </div>
            </section>

            {/* ═══ Footer ═══ */}
            <footer className="bg-white border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Store size={18} className="text-white" />
                            </div>
                            <h1 className="font-black text-lg tracking-tighter">LUXE<span className="text-primary-500">POS</span></h1>
                        </Link>

                        <div className="flex items-center gap-8">
                            <button onClick={toggleLanguage}
                                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">
                                <Languages size={14} />
                                {locale === 'id' ? 'EN' : 'ID'}
                            </button>
                            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{t('footer.privacy')}</a>
                            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{t('footer.terms')}</a>
                            <Link to="/about" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{t('footer.contact')}</Link>
                        </div>

                        <p className="text-sm font-bold text-slate-400">
                            {t('footer.createdBy')} <Link to="/about" className="text-slate-900 font-black tracking-tighter hover:text-primary-600 transition-colors">bikinsite</Link>
                        </p>
                    </div>

                    <div className="mt-16 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">{t('footer.rights')}</p>
                    </div>
                </div>
            </footer>

            {/* Animations */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 1s ease-out forwards; }
                .animate-bounce-slow { animation: bounceSlow 3s ease-in-out infinite; }
                @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
            `}</style>
        </div>
    );
};

export default Landing;
