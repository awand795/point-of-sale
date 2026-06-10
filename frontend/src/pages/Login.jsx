import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { Store, Zap, ShieldCheck, BarChart3, ShoppingCart, ArrowRight } from 'lucide-react';

const Login = () => {
    const { login, loading, error } = useAuth();
    const [searchParams] = useSearchParams();
    const { t, locale } = useLanguage();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        if (searchParams.get('demo') === 'true') {
            setFormData({
                email: 'demo@example.com',
                password: 'demo1234'
            });
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(formData, searchParams.get('demo') === 'true');
    };

    const features = [
        {
            icon: <ShoppingCart size={20} />,
            title: locale === 'id' ? 'Penjualan Real-time' : 'Real-time Sales',
            desc: locale === 'id' ? 'Track setiap transaksi secara langsung' : 'Track every transaction instantly',
        },
        {
            icon: <ShieldCheck size={20} />,
            title: locale === 'id' ? 'Stok Cerdas' : 'Smart Inventory',
            desc: locale === 'id' ? 'Peringatan stok otomatis' : 'Automatic stock alerts',
        },
        {
            icon: <BarChart3 size={20} />,
            title: locale === 'id' ? 'Laporan Detail' : 'Detailed Reports',
            desc: locale === 'id' ? 'Analitik bisnis yang mudah dipahami' : 'Easy-to-understand business analytics',
        },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Left: Brand side */}
            <div className="hidden lg:flex w-[50%] bg-[#0D5C63] relative overflow-hidden flex-col justify-between p-12 transition-colors duration-300">
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
                        backgroundSize: '24px 24px',
                    }}
                />
                <div className="relative">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center">
                            <Store size={20} className="text-white" />
                        </div>
                        <span className="text-base font-semibold text-white/90">BikinPOS</span>
                    </div>
                </div>
                <div className="relative space-y-10">
                    {features.map((f, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white/80 shrink-0">
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-white">{f.title}</h3>
                                <p className="text-xs text-white/60 mt-1">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="relative">
                    <p className="text-sm text-white/70 italic leading-relaxed">
                        &ldquo;{locale === 'id'
                            ? 'BikinPOS membantu kami mengelola 3 toko dari satu dashboard. Luar biasa!'
                            : 'BikinPOS helps us manage 3 stores from one dashboard. Amazing!'}&rdquo;
                    </p>
                    <p className="text-xs text-white/50 mt-3 font-medium">
                        &mdash; {locale === 'id' ? 'Pengguna BikinPOS' : 'BikinPOS User'}
                    </p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#0D1117] transition-colors duration-300">
                <div className="w-full max-w-sm">
                    <Link to="/" className="inline-flex items-center gap-2.5 mb-10 group lg:hidden">
                        <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                            <Store size={20} className="text-white" />
                        </div>
                        <span className="text-base font-semibold text-slate-900 tracking-tight">Bikin<span className="text-primary-500">POS</span></span>
                    </Link>

                    <h1 className="text-xl font-semibold text-slate-900 tracking-tight">{t('login.welcomeBack')}</h1>
                    <p className="text-sm text-slate-500 mt-1 mb-8">{t('login.subtitle')}</p>

                    {searchParams.get('demo') === 'true' && (
                        <div className="mb-6 px-4 py-3 bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-lg flex items-start gap-2.5">
                            <Zap size={16} className="text-primary-600 dark:text-primary-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs font-semibold text-primary-700 dark:text-primary-300">{t('login.demoMode')}</p>
                                <p className="text-[11px] text-primary-600 dark:text-primary-400 mt-0.5">{t('login.demoText')}</p>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {searchParams.get('expired') === 'true' && !error && (
                        <div className="mb-5 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400">
                            {locale === 'id' ? 'Sesi Anda telah berakhir. Silakan masuk kembali.' : 'Your session has expired. Please log in again.'}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                className="peer w-full h-11 px-3.5 pt-3.5 pb-1.5 bg-transparent border border-slate-200 dark:border-white/[0.12] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="email"
                                className={`absolute left-3.5 transition-all pointer-events-none ${
                                    focusedField === 'email' || formData.email
                                        ? 'text-[9px] font-medium -top-2 bg-surface px-1 text-primary-500 dark:text-primary-400'
                                        : 'text-sm text-slate-400 top-1/2 -translate-y-1/2'
                                }`}
                            >
                                {t('login.email')}
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                className="peer w-full h-11 px-3.5 pt-3.5 pb-1.5 bg-transparent border border-slate-200 dark:border-white/[0.12] rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                                placeholder=" "
                                required
                            />
                            <label
                                htmlFor="password"
                                className={`absolute left-3.5 transition-all pointer-events-none ${
                                    focusedField === 'password' || formData.password
                                        ? 'text-[9px] font-medium -top-2 bg-surface px-1 text-primary-500 dark:text-primary-400'
                                        : 'text-sm text-slate-400 top-1/2 -translate-y-1/2'
                                }`}
                            >
                                {t('login.password')}
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    {t('login.authenticating')}
                                </span>
                            ) : (
                                <>
                                    {t('login.signIn')}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link to="/" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                            {t('login.backToHome')}
                        </Link>
                    </div>

                    <p className="text-center mt-6 text-[10px] text-slate-400 dark:text-slate-500">
                        {t('login.poweredBy')}{' '}
                        <Link to="/about" className="font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                            bikinsite
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
