import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Tags,
    Receipt,
    LogOut,
    Users,
    Store
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
    const location = useLocation();
    const { logout, isAdmin } = useAuth();

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/pos', label: 'POS', icon: ShoppingCart },
        { path: '/products', label: 'Products', icon: Package },
        { path: '/categories', label: 'Categories', icon: Tags },
        { path: '/transactions', label: 'Transactions', icon: Receipt },
        ...(isAdmin ? [{ path: '/users', label: 'Users', icon: Users }] : []),
    ];

    return (
        <aside className="w-64 bg-sidebar flex flex-col h-screen shrink-0">
            {/* Logo */}
            <div className="px-6 py-5 flex items-center gap-3 border-b border-white/10">
                <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Store size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-white font-bold text-lg leading-tight">POS System</h1>
                    <p className="text-slate-400 text-xs">Point of Sale</p>
                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                                    : 'text-slate-400 hover:bg-sidebar-hover hover:text-white'
                            }`}
                        >
                            <Icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
