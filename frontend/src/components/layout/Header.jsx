import { useAuth } from '../../hooks/useAuth';
import { Bell } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shrink-0">
            <div>
                <h2 className="text-sm text-slate-500">Welcome back,</h2>
                <p className="text-base font-semibold text-slate-800">{user?.name || 'User'}</p>
            </div>
            <div className="flex items-center gap-3">
                <button className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
                    <Bell size={16} />
                </button>
                <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export default Header;
