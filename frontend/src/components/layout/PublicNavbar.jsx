import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Store, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const PublicNavbar = () => {
    const { t, locale, toggleLanguage } = useLanguage();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Helper to check if a link is active
    const isActive = (path) => {
        if (path === '#features') return location.pathname === '/';
        return location.pathname === path;
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? 'bg-white/95 dark:bg-[#0C1811]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/[0.06] shadow-sm'
                    : 'bg-white dark:bg-[#0C1811] border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
                    <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Store size={16} className="text-white" />
                    </div>
                    <span className="font-bold text-[16px] tracking-[-0.03em] text-ink-900 dark:text-white">
                        Bikin<span className="text-brand">POS</span>
                    </span>
                </Link>

                {/* Nav Links - Center */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { href: '/#features', label: t('nav.features'), isAnchor: true },
                        { href: '/pricing', label: t('nav.pricing') },
                        { href: '/about', label: t('nav.about') },
                    ].map((item) => {
                        const active = isActive(item.href.replace('/#', '#'));
                        const cls = `px-4 py-2 text-[14px] font-medium rounded-lg transition-all ${
                            active
                                ? 'text-brand bg-brand/5 dark:bg-brand/10'
                                : 'text-ink-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white hover:bg-ink-50 dark:hover:bg-white/[0.05]'
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-2 text-[13px] font-semibold text-ink-400 dark:text-slate-500 hover:text-ink-900 dark:hover:text-white transition-colors"
                    >
                        {locale === 'id' ? 'EN' : 'ID'}
                    </button>
                    <Link
                        to="/login"
                        className="hidden sm:block px-4 py-2 text-[14px] font-medium text-ink-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white rounded-lg hover:bg-ink-50 dark:hover:bg-white/[0.05] transition-all"
                    >
                        {t('nav.signIn')}
                    </Link>
                    <Link
                        to="/login?demo=true"
                        className="px-5 py-2 bg-brand text-white text-[14px] font-semibold rounded-lg hover:bg-primary-600 transition-all active:scale-[0.97] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center gap-1.5 shadow-sm"
                    >
                        {t('nav.tryDemo')} <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default PublicNavbar;
