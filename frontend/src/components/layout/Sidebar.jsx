import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Tags,
    Receipt,
    LogOut,
    Users,
    Store,
    Languages
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../i18n/LanguageContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout, isAdmin } = useAuth();
    const { t, toggleLanguage, locale } = useLanguage();

    const menuItems = [
        { path: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { path: '/pos', label: t('sidebar.pos'), icon: ShoppingCart },
        { path: '/products', label: t('sidebar.products'), icon: Package },
        { path: '/categories', label: t('sidebar.categories'), icon: Tags },
        { path: '/transactions', label: t('sidebar.transactions'), icon: Receipt },
        ...(isAdmin ? [{ path: '/users', label: t('sidebar.users'), icon: Users }] : []),
    ];

    return (
        <aside className="w-64 bg-sidebar flex flex-col h-screen shrink-0">
            {/* Logo */}
            <div className="px-8 py-10 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-900/50 rotate-3">
                    <Store size={22} className="text-white -rotate-3" />
                </div>
                <div>
                    <h1 className="text-white font-black text-xl tracking-tighter leading-none">LUXE<span className="text-primary-500">POS</span></h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">{t('sidebar.enterprise')}</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-4 px-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${
                                isActive
                                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-900/40 translate-x-1'
                                    : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                            }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Language Switcher & Logout */}
            <div className="px-4 py-6 space-y-2">
                <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-white/5 hover:text-slate-200 transition-all duration-300"
                >
                    <Languages size={18} />
                    {locale === 'id' ? 'English' : 'Indonesia'}
                </button>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
                >
                    <LogOut size={18} />
                    {t('sidebar.logout')}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
