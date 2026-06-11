import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import { Store, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const PublicNavbar = () => {
    const { t, locale, toggleLanguage } = useLanguage();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === '/#features') return location.pathname === '/';
        return location.pathname === path;
    };

    return (
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
                    <span className="font-bold text-[15px] tracking-[-0.03em] text-slate-900 dark:text-white">
                        Bikin<span className="text-primary-500">POS</span>
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-0.5 ml-1">
                    {[
                        { href: '/#features', label: t('nav.features'), isAnchor: true },
                        { href: '/pricing', label: t('nav.pricing') },
                        { href: '/about', label: t('nav.about') },
                    ].map((item) => {
                        const active = isActive(item.href);
                        const cls = `px-3.5 py-1.5 text-[14px] font-medium rounded-xl transition-all ${
                            active
                                ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                        }`;

                        return item.isAnchor ? (
                            <a key={item.label} href={item.href} className={cls}>
                                {item.label}
                            </a>
                        ) : (
                            <Link key={item.label} to={item.href} className={cls}>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-1.5 ml-1">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-1.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                    >
                        {locale === 'id' ? 'EN' : 'ID'}
                    </button>
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
    );
};

export default PublicNavbar;
