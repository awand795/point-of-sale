import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { 
    Store, 
    ShoppingCart, 
    Package, 
    BarChart3, 
    ShieldCheck, 
    Zap, 
    ArrowRight,
    ChevronRight,
    MousePointer2,
    MonitorSmartphone,
    Globe,
    Languages
} from 'lucide-react';

const Landing = () => {
    const { t, locale, toggleLanguage } = useLanguage();
    const features = t('features.items');

    return (
        <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-100 rotate-3">
                            <Store size={22} className="text-white -rotate-3" />
                        </div>
                        <h1 className="font-black text-xl tracking-tighter leading-none">LUXE<span className="text-primary-500">POS</span></h1>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
                        <a href="#features" className="hover:text-primary-600 transition-colors">{t('nav.features')}</a>
                        <Link to="/pricing" className="hover:text-primary-600 transition-colors">{t('nav.pricing')}</Link>
                        <Link to="/about" className="hover:text-primary-600 transition-colors">{t('nav.about')}</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-primary-600 transition-all relative group"
                            title={locale === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
                        >
                            <Languages size={18} />
                            <span className="absolute mt-14 text-[8px] font-black uppercase tracking-widest text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                {locale === 'id' ? 'EN' : 'ID'}
                            </span>
                        </button>
                        <Link to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">{t('nav.signIn')}</Link>
                        <Link 
                            to="/login?demo=true" 
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-2xl hover:bg-primary-600 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center gap-2"
                        >
                            {t('nav.tryDemo')} <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-40 pb-32 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-50">
                    <div className="absolute top-40 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-violet-100 rounded-full blur-[100px]"></div>
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full mb-8 animate-bounce-slow">
                        <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('hero.badge')}</span>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-8">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-violet-600">{t('hero.title1')}</span> <br />
                        {t('hero.title2')}
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg text-slate-500 font-medium leading-relaxed mb-12">
                        {t('hero.subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link 
                            to="/login?demo=true" 
                            className="w-full sm:w-auto px-10 py-5 bg-primary-600 text-white font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-primary-700 shadow-2xl shadow-primary-200 transition-all flex items-center justify-center gap-3"
                        >
                            <Zap size={18} /> {t('hero.launchDemo')}
                        </Link>
                        <button className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-100 text-slate-800 font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-slate-50 hover:border-slate-200 transition-all flex items-center justify-center gap-3">
                            <MonitorSmartphone size={18} /> {t('hero.watchPreview')}
                        </button>
                    </div>

                    <div className="mt-20 relative px-4">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-violet-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl overflow-hidden shadow-slate-900/30 ring-1 ring-white/10">
                            <div className="aspect-video bg-slate-800 rounded-[1.5rem] flex items-center justify-center relative group">
                                <img 
                                    src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=2000" 
                                    alt="POS Dashboard Preview" 
                                    className="w-full h-full object-cover rounded-[1.5rem] opacity-60 group-hover:scale-[1.02] transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                                    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                        <MousePointer2 size={32} fill="white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-32 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-[10px] font-black text-primary-600 uppercase tracking-[0.4em] mb-4">{t('features.title')}</h2>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">{t('features.subtitle')}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <ShoppingCart className="text-primary-600" /> },
                            { icon: <Package className="text-violet-600" /> },
                            { icon: <BarChart3 className="text-emerald-600" /> },
                            { icon: <ShieldCheck className="text-orange-600" /> },
                            { icon: <Zap className="text-blue-600" /> },
                            { icon: <Globe className="text-slate-600" /> },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h4 className="text-xl font-black text-slate-800 mb-4">{features[idx]?.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{features[idx]?.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                        {locale === 'id' ? 'Siap Memodernisasi Bisnis Anda?' : 'Ready to Modernize Your Business?'}
                    </h2>
                    <p className="text-lg text-slate-300 font-medium mb-10 max-w-2xl mx-auto">
                        {locale === 'id' 
                            ? 'Mulai hari ini dan rasakan kemudahan mengelola bisnis dengan LuxePOS. Gratis untuk dicoba!'
                            : 'Start today and experience the ease of managing your business with LuxePOS. Free to try!'}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/login?demo=true"
                            className="px-10 py-5 bg-primary-600 text-white font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-primary-700 shadow-2xl shadow-primary-900/30 transition-all flex items-center justify-center gap-3"
                        >
                            <Zap size={18} /> {t('hero.launchDemo')}
                        </Link>
                        <Link
                            to="/pricing"
                            className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-black uppercase tracking-widest text-sm rounded-3xl hover:bg-white/20 transition-all flex items-center justify-center gap-3"
                        >
                            {t('nav.pricing')} <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
                                <Store size={18} className="text-white" />
                            </div>
                            <h1 className="font-black text-lg tracking-tighter">LUXE<span className="text-primary-500">POS</span></h1>
                        </Link>

                        <div className="flex items-center gap-8">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors"
                            >
                                <Languages size={14} />
                                {locale === 'id' ? 'EN' : 'ID'}
                            </button>
                            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{t('footer.privacy')}</a>
                            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{t('footer.terms')}</a>
                            <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors">{t('footer.contact')}</a>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-bold text-slate-400">
                                {t('footer.createdBy')} <Link to="/about" className="text-slate-900 font-black tracking-tighter hover:text-primary-600 transition-colors cursor-pointer">bikinsite</Link>
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-16 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">{t('footer.rights')}</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
