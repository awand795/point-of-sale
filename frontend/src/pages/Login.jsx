import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams, Link } from 'react-router-dom';
import { Store, Mail, Lock, Zap, ArrowLeft } from 'lucide-react';

const Login = () => {
    const { login, loading, error } = useAuth();
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({ email: '', password: '' });

    useEffect(() => {
        if (searchParams.get('demo') === 'true') {
            setFormData({
                email: 'admin@example.com',
                password: 'password'
            });
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-[100px]"></div>
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-violet-100 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md mx-4">
                <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-primary-600 transition-colors group">
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                </Link>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-10 border border-slate-100">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-100 rotate-3">
                            <Store size={28} className="text-white -rotate-3" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-400 text-sm font-medium mt-2">Access your LuxePOS terminal</p>
                    </div>

                    {searchParams.get('demo') === 'true' && (
                        <div className="mb-8 p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-start gap-3">
                            <Zap size={18} className="text-primary-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-black text-primary-700 uppercase tracking-tight">Demo Mode Active</p>
                                <p className="text-[11px] text-primary-600 font-medium mt-0.5">We've pre-filled the credentials for you. Just click Sign In to explore!</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-sm font-bold text-slate-700"
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none text-sm font-bold text-slate-700"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`w-full py-5 bg-primary-600 text-white font-black uppercase tracking-widest text-sm rounded-2xl hover:bg-primary-700 shadow-xl shadow-primary-100 transition-all active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Sign In to System'}
                        </button>
                    </form>
                </div>
                
                <p className="text-center mt-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    Powered by <span className="text-slate-900 tracking-tighter">bikinsite</span>
                </p>
            </div>
        </div>
    );
}

export default Login;
