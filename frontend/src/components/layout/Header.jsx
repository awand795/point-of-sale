import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../i18n/LanguageContext';
import { Bell, Languages, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const Header = () => {
    const { user, isDemo } = useAuth();
    const { t, locale, toggleLanguage } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center shrink-0 sticky top-0 z-50 transition-colors duration-300">
            <div className="flex items-center gap-3">
                <div>
                    <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{t('header.currentSession')}</h2>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{user?.name || 'User Account'}</p>
                </div>
                {isDemo && (
                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-amber-200 dark:border-amber-700 shadow-sm">
                        DEMO
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => toggleTheme(e.clientX, e.clientY)}
                    className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all relative group"
                >
                    {isDark ? <Sun key={isDark ? 'dark' : 'light'} size={18} className="theme-icon-enter" /> : <Moon key={isDark ? 'dark' : 'light'} size={18} className="theme-icon-enter" />}
                    <span className="absolute mt-12 text-[8px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {isDark ? (locale === 'id' ? 'Terang' : 'Light') : (locale === 'id' ? 'Gelap' : 'Dark')}
                    </span>
                </button>
                <button
                    onClick={toggleLanguage}
                    className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all relative group"
                >
                    <Languages size={18} />
                    <span className="absolute mt-12 text-[8px] font-black uppercase tracking-widest text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {locale === 'id' ? 'EN' : 'ID'}
                    </span>
                </button>
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">{t('header.date')}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <button className="relative w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all group">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary-100 dark:shadow-primary-900/30">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
