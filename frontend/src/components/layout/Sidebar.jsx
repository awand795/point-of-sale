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
    Languages,
    UserCircle,
    Truck,
    PackageCheck,
    Tag,
    BarChart3,
    Settings2,
    Moon,
    Sun,
    ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../i18n/LanguageContext';
import { useTheme } from '../../hooks/useTheme';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const { logout, isAdmin, user } = useAuth();
    const { t, toggleLanguage, locale } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const mainMenu = [
        { path: '/dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
        { path: '/pos', label: t('sidebar.pos'), icon: ShoppingCart },
        { path: '/products', label: t('sidebar.products'), icon: Package },
        { path: '/categories', label: t('sidebar.categories'), icon: Tags },
        { path: '/transactions', label: t('sidebar.transactions'), icon: Receipt },
    ];

    const crmMenu = [
        { path: '/customers', label: t('sidebar.customers'), icon: UserCircle },
        { path: '/suppliers', label: t('sidebar.suppliers'), icon: Truck },
    ];

    const inventoryMenu = [
        { path: '/purchases', label: t('sidebar.purchases'), icon: PackageCheck },
        { path: '/discounts', label: t('sidebar.discounts'), icon: Tag },
    ];

    const managementMenu = [
        { path: '/stores', label: t('sidebar.stores'), icon: Store },
        { path: '/reports', label: t('sidebar.reports'), icon: BarChart3 },
        ...(isAdmin ? [{ path: '/users', label: t('sidebar.users'), icon: Users }] : []),
        { path: '/settings', label: t('sidebar.settings'), icon: Settings2 },
    ];

    const NavItem = ({ item }) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
            <Link
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.04]'
                }`}
            >
                {/* Active indicator bar */}
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-primary-500" />
                )}
                <Icon size={18} className="shrink-0" />
                {item.label}
            </Link>
        );
    };

    const MenuGroup = ({ items }) => (
        <div className="space-y-0.5">
            {items.map((item) => (
                <NavItem key={item.path} item={item} />
            ))}
        </div>
    );

    const Divider = () => (
        <div className="my-3 mx-4 border-t border-white/[0.06]" />
    );

    return (
        <aside className="w-60 bg-[#0A0F14] flex flex-col h-screen shrink-0 select-none">
            {/* Logo — compact */}
            <div className="px-5 h-14 flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Store size={18} className="text-white" />
                </div>
                <h1 className="text-white font-semibold text-base tracking-tight leading-none">
                    Bikin<span className="text-primary-400">POS</span>
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
                <MenuGroup items={mainMenu} />
                <Divider />
                <MenuGroup items={crmMenu} />
                <Divider />
                <MenuGroup items={inventoryMenu} />
                <Divider />
                <MenuGroup items={managementMenu} />
            </nav>

            {/* Bottom area: User + Actions */}
            <div className="shrink-0 border-t border-white/[0.06] px-3 py-3">
                <div className="relative">
                    {/* User row — clickable to open dropdown */}
                    <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all text-left"
                    >
                        <div className="w-7 h-7 rounded-md bg-primary-500/20 flex items-center justify-center text-primary-400 text-[11px] font-semibold shrink-0">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-slate-300 truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-[10px] text-slate-500 truncate">
                                {user?.email || ''}
                            </p>
                        </div>
                        <ChevronDown
                            size={14}
                            className={`shrink-0 transition-transform duration-200 ${
                                userMenuOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>

                    {/* User dropdown */}
                    {userMenuOpen && (
                        <div className="absolute bottom-full left-2 right-2 mb-2 bg-[#161B22] border border-white/[0.06] rounded-xl shadow-xl overflow-hidden animate-fadeIn">
                            <button
                                onClick={(e) => {
                                    toggleTheme(e.clientX, e.clientY);
                                    setUserMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
                            >
                                {isDark ? <Sun size={14} /> : <Moon size={14} />}
                                {isDark
                                    ? locale === 'id' ? 'Terang' : 'Light'
                                    : locale === 'id' ? 'Gelap' : 'Dark'}
                            </button>
                            <button
                                onClick={() => {
                                    toggleLanguage();
                                    setUserMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-all"
                            >
                                <Languages size={14} />
                                {locale === 'id' ? 'English' : 'Indonesia'}
                            </button>
                            <div className="border-t border-white/[0.06]" />
                            <button
                                onClick={() => {
                                    logout();
                                    setUserMenuOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                                <LogOut size={14} />
                                {t('sidebar.logout')}
                            </button>
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
        </aside>
    );
};

export default Sidebar;
