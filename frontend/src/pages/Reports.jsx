import { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Package, Calendar, Download, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState";
import { useReports } from '../hooks/useReports';

const Reports = () => {
    const { t } = useLanguage();
    const { reports, loading, error, filterByDate } = useReports();
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const handleFilter = () => {
        if (dateRange.start && dateRange.end) {
            filterByDate(dateRange.start, dateRange.end);
        }
    };

    const stats = reports ? [
        { title: 'Total Revenue', value: `Rp ${Number(reports.total_revenue || 0).toLocaleString('id-ID')}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+0%' },
        { title: 'Total Orders', value: reports.total_orders || '0', icon: ShoppingBag, color: 'text-primary-600', bg: 'bg-primary-50', change: '+0%' },
        { title: 'Items Sold', value: reports.total_items || '0', icon: Package, color: 'text-violet-600', bg: 'bg-violet-50', change: '+0%' },
        { title: 'Avg. Order Value', value: `Rp ${Number(reports.avg_order_value || 0).toLocaleString('id-ID')}`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', change: '+0%' },
    ] : [
        { title: 'Total Revenue', value: 'Rp 0', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+0%' },
        { title: 'Total Orders', value: '0', icon: ShoppingBag, color: 'text-primary-600', bg: 'bg-primary-50', change: '+0%' },
        { title: 'Items Sold', value: '0', icon: Package, color: 'text-violet-600', bg: 'bg-violet-50', change: '+0%' },
        { title: 'Avg. Order Value', value: 'Rp 0', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', change: '+0%' },
    ];

    if (loading) return <LoadingSpinner text="Memuat laporan..." />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('sidebar.reports')}</h1>
                    <p className="text-sm text-slate-500 font-medium font-medium">Business analytics and performance reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
                        <input type="date" value={dateRange.start} onChange={(e) => setDateRange(d => ({ ...d, start: e.target.value }))} className="px-3 py-2 bg-slate-50 border border-transparent rounded-xl text-xs font-bold focus:bg-white focus:border-primary-200 outline-none transition-all" />
                        <span className="text-xs text-slate-400">—</span>
                        <input type="date" value={dateRange.end} onChange={(e) => { setDateRange(d => ({ ...d, end: e.target.value })); setTimeout(() => handleFilter(), 0); }} className="px-3 py-2 bg-slate-50 border border-transparent rounded-xl text-xs font-bold focus:bg-white focus:border-primary-200 outline-none transition-all" />
                    </div>
                    <button onClick={handleFilter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-bold hover:bg-primary-600 transition-all shadow-sm">
                        <Calendar size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="flex items-start justify-between">
                                <div className="space-y-3">
                                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                        <p className="text-2xl font-black text-slate-900 tracking-tight mt-1">{stat.value}</p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <ArrowUpRight size={10} className="mr-0.5" /> {stat.change}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center"><BarChart3 size={24} className="text-primary-600" /></div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 tracking-tight">Revenue Overview</h2>
                            <p className="text-xs text-slate-400 font-medium mt-0.5">Daily revenue chart for selected period</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="text-center">
                        <BarChart3 size={48} className="mx-auto text-slate-300 mb-3" />
                        <p className="text-sm font-bold text-slate-400">{reports ? 'Chart data loaded' : 'Revenue chart will appear here'}</p>
                        <p className="text-xs text-slate-300 mt-1">Select a date range to generate reports</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Top Products</h2>
                    <div className="flex items-center justify-center h-48 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="text-center">
                            <Package size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-bold text-slate-400">{reports?.top_products?.length ? `${reports.top_products.length} products` : 'No data yet'}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 p-8">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">Sales by Category</h2>
                    <div className="flex items-center justify-center h-48 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="text-center">
                            <BarChart3 size={32} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-bold text-slate-400">No data yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
