import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../i18n/LanguageContext';
import { Bell, Moon, Sun, Languages, LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useLocation, Link } from 'react-router-dom';

// Route label map
const ROUTE_LABELS = {
    '/dashboard': { id: 'Dasbor', en: 'Dashboard' },
    '/pos': { id: 'POS', en: 'POS' },
    '/products': { id: 'Produk', en: 'Products' },
    '/categories': { id: 'Kategori', en: 'Categories' },
    '/transactions': { id: 'Transaksi', en: 'Transactions' },
    '/customers': { id: 'Pelanggan', en: 'Customers' },
    '/suppliers': { id: 'Pemasok', en: 'Suppliers' },
    '/purchases': { id: 'Pembelian', en: 'Purchases' },
    '/discounts': { id: 'Diskon', en: 'Discounts' },
    '/stores': { id: 'Toko', en: 'Stores' },
    '/reports': { id: 'Laporan', en: 'Reports' },
    '/settings': { id: 'Pengaturan', en: 'Settings' },
    '/users': { id: 'Pengguna', en: 'Users' },
};

const Header = () => {
    const { user, isDemo, logout } = useAuth();
    const { locale, toggleLanguage } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLabel = ROUTE_LABELS[location.pathname]?.[locale] || location.pathname.replace('/', '').charAt(0).toUpperCase() + location.pathname.slice(2);

    // Today's date formatted
    const todayDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    // Close dropdown on click outside
    useEffect(() => {
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <header className="h-[56px] bg-surface border-b border-white/[0.08] dark:border-white/[0.08] flex items-center justify-between px-6 shrink-0 sticky top-0 z-50">
            {/* Left: breadcrumb-style page name + date */}
            <div className="flex items-center gap-3">
                <div>
                    <h2 className="text-[15px] font-semibold text-slate-800 dark:text-slate-200 tracking-tight flex items-center gap-2">
                        {currentLabel}
                        {isDemo && (
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[9px] font-semibold rounded-md border border-amber-200 dark:border-amber-700/50">
                                DEMO
                            </span>
                        )}
                    </h2>
                    <p className="text-[12px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                        {todayDate}
                    </p>
                </div>
            </div>

            {/* Right: Notification + User dropdown */}
            <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button
                    title="Notifikasi"
                    className="relative w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                >
                    <Bell size={18} />
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-500 rounded-full ring-2 ring-white dark:ring-surface animate-pulse" />
                </button>

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all text-left"
                    >
                        <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-[11px] font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-[13px] font-medium text-slate-700 dark:text-slate-300 leading-tight">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
                                {user?.role === 'admin' ? 'Administrator' : 'Kasir'}
                            </p>
                        </div>
                        <ChevronDown
                            size={12}
                            className={`text-slate-400 transition-transform duration-200 ${
                                dropdownOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface dark:bg-surface-raised border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-xl dark:shadow-black/40 overflow-hidden z-50 animate-fadeIn">
                            {/* User info with large avatar */}
                            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.06]">
                                <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-600 dark:text-primary-400 text-sm font-semibold shrink-0">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-[14px] font-medium text-slate-800 dark:text-slate-200 truncate">
                                        {user?.name || 'User'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                        {user?.email || ''}
                                    </p>
                                </div>
                            </div>

                            {/* Menu items */}
                            <div className="py-1">
                                <Link
                                    to="/settings"
                                    onClick={() => setDropdownOpen(false)}
                                    className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-slate-200 transition-all"
                                >
                                    <Settings size={16} />
                                    Settings
                                </Link>
                                <button
                                    onClick={(e) => {
                                        toggleTheme(e.clientX, e.clientY);
                                        setDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-slate-200 transition-all"
                                >
                                    {isDark ? <Sun size={16} /> : <Moon size={16} />}
                                    {isDark ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <button
                                    onClick={() => {
                                        toggleLanguage();
                                        setDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/[0.04] hover:text-slate-800 dark:hover:text-slate-200 transition-all"
                                >
                                    <Languages size={16} />
                                    {locale === 'id' ? 'English' : 'Indonesia'}
                                </button>
                            </div>

                            <div className="border-t border-slate-100 dark:border-white/[0.06] py-1">
                                <button
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 transition-all"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.15s ease-out both;
                }
            `}</style>
        </header>
    );
};

export default Header;
