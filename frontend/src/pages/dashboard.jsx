import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingBag,
    Package,
    AlertTriangle,
    ArrowUpRight,
    BarChart3
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { transactionApi } from "../api/transactions";
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState";

const StatCard = ({ title, value, icon, color, bgColor, trend }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
        <div className="flex items-start justify-between">
            <div className="space-y-3">
                <div className={`w-12 h-12 ${bgColor} ${color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">{value}</p>
                </div>
                {trend && (
                    <div className="flex items-center gap-1.5">
                        <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <ArrowUpRight size={10} className="mr-0.5" /> {trend}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">vs last month</span>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { t } = useLanguage();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = () => {
        setLoading(true);
        setError(null);
        transactionApi.getDashboard()
            .then(res => {
                setDashboard(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.response?.data?.message || 'Failed to load dashboard data');
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDashboard();
        const timeoutId = setTimeout(() => {
            setLoading(l => {
                if (l) {
                    setError('Request timed out. Server may be starting up...');
                    return false;
                }
                return l;
            });
        }, 15000);
        return () => clearTimeout(timeoutId);
    }, []);

    if (loading) {
        return <LoadingSpinner text="Memuat dashboard..." />;
    }

    if (error || !dashboard) {
        return (
            <div className="space-y-10">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
                    <p className="text-sm text-slate-500 font-medium">{t('dashboard.subtitle')}</p>
                </div>
                <EmptyState
                    icon={BarChart3}
                    title="Dashboard Belum Siap"
                    description={error || "Data dashboard belum tersedia. Sistem mungkin masih memulai atau belum ada data transaksi."}
                    action
                    onAction={fetchDashboard}
                    actionLabel="Muat Ulang"
                />
            </div>
        );
    }

    const stats = [
        {
            title: t('dashboard.todayRevenue'),
            value: `Rp ${Number(dashboard.stats?.today_sales ?? 0).toLocaleString('id-ID')}`,
            icon: <DollarSign size={24} />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: t('dashboard.transactionCount'),
            value: dashboard.stats?.today_transactions ?? 0,
            icon: <ShoppingBag size={24} />,
            color: "text-primary-600",
            bgColor: "bg-primary-50"
        },
        {
            title: t('dashboard.itemsMoved'),
            value: dashboard.stats?.today_items_sold ?? 0,
            icon: <Package size={24} />,
            color: "text-violet-600",
            bgColor: "bg-violet-50"
        },
        {
            title: t('dashboard.inventoryAlerts'),
            value: dashboard.stats?.low_stock_products ?? 0,
            icon: <AlertTriangle size={24} />,
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
    ];

    const recentTransactions = dashboard.recent_transactions || [];
    const topProducts = dashboard.top_products || [];

    return (
        <div className="space-y-10">
            <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
                <p className="text-sm text-slate-500 font-medium">{t('dashboard.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} trend={index === 0 ? "12.5" : null} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">{t('dashboard.recentActivity')}</h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">{t('dashboard.recentDesc')}</p>
                        </div>
                        <button className="text-xs font-bold text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all">{t('dashboard.viewAllReports')}</button>
                    </div>
                    <div className="p-2">
                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <BarChart3 size={36} className="text-slate-200" />
                                </div>
                                <p className="text-base font-bold text-slate-400">Belum Ada Transaksi</p>
                                <p className="text-xs text-slate-300 mt-1">Mulai bertransaksi untuk melihat aktivitas di sini</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-6 py-4">{t('dashboard.invoice')}</th>
                                            <th className="px-6 py-4">{t('dashboard.customerUser')}</th>
                                            <th className="px-6 py-4 text-right">{t('dashboard.amount')}</th>
                                            <th className="px-6 py-4 text-center">{t('dashboard.status')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentTransactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-bold text-slate-800">{tx.invoice_number}</p>
                                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">{new Date(tx.created_at).toLocaleTimeString()}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-semibold text-slate-700">{tx.user?.name || 'Walk-in'}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <p className="text-sm font-black text-slate-900">Rp {Number(tx.total).toLocaleString('id-ID')}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                                        tx.status === 'paid'
                                                            ? 'bg-emerald-50 text-emerald-600'
                                                            : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
                        <h2 className="text-lg font-black text-slate-900 tracking-tight">{t('dashboard.bestsellers')}</h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{t('dashboard.bestsellersDesc')}</p>
                    </div>
                    <div className="flex-1 p-6">
                        {topProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                    <Package size={28} className="text-slate-200" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">Belum Ada Produk Terjual</p>
                                <p className="text-xs text-slate-300 mt-1">Data penjualan akan muncul di sini</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                                        <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-sm font-black shadow-sm ${
                                            index === 0 ? 'bg-amber-100 text-amber-600' : 
                                            index === 1 ? 'bg-slate-200 text-slate-600' :
                                            index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-white text-slate-400'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-primary-600 transition-colors">{item.product?.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-primary-500 rounded-full" 
                                                        style={{ width: `${Math.min(100, (item.total_sold / Math.max(dashboard.stats.today_items_sold, 1)) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">{item.total_sold} {t('dashboard.sold')}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
