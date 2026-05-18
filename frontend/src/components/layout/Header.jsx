import { useAuth } from '../../hooks/useAuth';
import { Bell } from 'lucide-react';

const Header = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0 sticky top-0 z-50">
            <div>
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Session</h2>
                <p className="text-sm font-bold text-slate-800">{user?.name || 'User Account'}</p>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end mr-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date</span>
                    <span className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <button className="relative w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-primary-600 transition-all group">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-primary-100">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
