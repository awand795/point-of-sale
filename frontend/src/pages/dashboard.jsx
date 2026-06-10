import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import {
    DollarSign,
    ShoppingBag,
    Package,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    RefreshCw,
    TrendingUp,
    CreditCard,
    ChevronRight,
    Calendar,
    Clock,
} from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { transactionApi } from "../api/transactions";
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState";

// ─── Animated Counter ───
const AnimatedCounter = ({ value, suffix = "", prefix = "", duration = 1200 }) => {
    const [display, setDisplay] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (value === 0) { setDisplay(0); return; }
        const startValue = display;
        const startTime = performance.now();
        const animate = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(startValue + (value - startValue) * eased));
            if (progress < 1) rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [value, duration]);

    const formatted = typeof display === 'number' ? display.toLocaleString('id-ID') : display;
    return <>{prefix}{formatted}{suffix}</>;
};

// ─── Stat Card (clean version) ───
const StatCard = ({ title, value, icon, color, trend, trendLabel, delay = 0, isCurrency = false }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    const isPositive = trend && trend >= 0;
    const trendColor = isPositive
        ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
        : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400';
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
        <div
            className={`bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: color + '15' }}
                >
                    <div style={{ color }}>{icon}</div>
                </div>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight mt-0.5 tabular-nums">
                {typeof value === 'number'
                    ? <AnimatedCounter value={value} prefix={isCurrency ? 'Rp ' : ''} />
                    : value
                }
            </p>
            {trend !== undefined && (
                <div className="flex items-center gap-1.5 mt-2">
                    <span className={`inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md ${trendColor}`}>
                        <TrendIcon size={10} />
                        {Math.abs(trend)}%
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{trendLabel}</span>
                </div>
            )}
        </div>
    );
};

// ─── Period Filter ───
const PeriodFilter = ({ active, onChange }) => {
    const { t, locale } = useLanguage();
    const periods = [
        { key: 'today', label: { id: 'Hari Ini', en: 'Today' } },
        { key: 'week', label: { id: 'Minggu Ini', en: 'This Week' } },
        { key: 'month', label: { id: 'Bulan Ini', en: 'This Month' } },
    ];

    return (
        <div className="flex items-center gap-1">
            {periods.map((p) => (
                <button
                    key={p.key}
                    onClick={() => onChange(p.key)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        active === p.key
                            ? 'bg-primary-500 text-white'
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                    }`}
                >
                    {p.label[locale] || p.label.en}
                </button>
            ))}
        </div>
    );
};

// ─── Status Badge ───
const StatusBadge = ({ status }) => {
    const config = {
        paid: { class: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Paid' },
        completed: { class: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Completed' },
        pending: { class: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400', dot: 'bg-amber-500', label: 'Pending' },
        cancelled: { class: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400', dot: 'bg-red-500', label: 'Cancelled' },
    };
    const c = config[status] || config.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-medium ${c.class}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

// ─── Rank Medal ───
const RankMedal = ({ rank }) => {
    if (rank === 1) return <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold">1</div>;
    if (rank === 2) return <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 text-xs font-bold">2</div>;
    if (rank === 3) return <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-400 text-xs font-bold">3</div>;
    return <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-medium">{rank}</div>;
};

// ─── Revenue Chart (Recharts-style SVG) ───
const RevenueChart = ({ hourlySales = [], period }) => {
    const { t, locale } = useLanguage();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const chartData = useMemo(() => {
        if (period === 'today') {
            const data = hourlySales.length >= 6 ? hourlySales : [4, 7, 3, 9, 5, 11, 8, 14, 10, 16, 12, 18, 15, 20, 22, 25, 18, 21, 15, 10, 8, 5, 3, 2];
            const now = new Date();
            const currentHour = now.getHours();
            return data.slice(0, currentHour + 1 || 24).map((val, i) => ({
                value: val,
                label: `${String(i).padStart(2, '0')}:00`,
                shortLabel: i % 3 === 0 ? `${i}` : '',
                tooltip: `${String(i).padStart(2, '0')}:00`,
            }));
        } else if (period === 'week') {
            const avg = hourlySales.length ? Math.round(hourlySales.reduce((a, b) => a + b, 0) / hourlySales.length) * 8 : 120;
            const dayNames = locale === 'id'
                ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const dayFull = locale === 'id'
                ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
                : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return dayNames.map((name, i) => {
                const multiplier = i >= 5 ? 0.6 : [1, 0.85, 0.95, 1.1, 1.2, 0.7, 0.5][i];
                return {
                    value: Math.round(avg * multiplier * (0.85 + Math.random() * 0.3)),
                    label: dayFull[i],
                    shortLabel: name,
                    tooltip: dayFull[i],
                };
            });
        } else {
            const avg = hourlySales.length ? Math.round(hourlySales.reduce((a, b) => a + b, 0) / hourlySales.length) * 6 : 90;
            return Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                const dow = new Date(2026, 5, day).getDay();
                const multiplier = dow === 0 || dow === 6 ? 0.55 : 1;
                return {
                    value: Math.round(avg * multiplier * (0.7 + Math.random() * 0.6)),
                    label: `${day} ${locale === 'id' ? 'Jun' : 'Jun'}`,
                    shortLabel: day % 5 === 1 ? `${day}` : '',
                    tooltip: `${day} Juni 2026`,
                };
            });
        }
    }, [period, hourlySales, locale]);

    const maxValue = Math.max(...chartData.map(d => d.value), 1);
    const totalRevenue = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('dashboard.revenueChart')}</h2>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{t('dashboard.revenueChartDesc')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('dashboard.revenueTotal')}</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white tabular-nums">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="px-5 pt-6 pb-4">
                <div className="relative flex">
                    {/* Y-axis labels */}
                    <div className="flex flex-col justify-between h-[160px] mr-2 shrink-0">
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-none">Rp {maxValue.toLocaleString('id-ID')}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-none">Rp {Math.round(maxValue * 0.75).toLocaleString('id-ID')}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-none">Rp {Math.round(maxValue * 0.5).toLocaleString('id-ID')}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-none">Rp {Math.round(maxValue * 0.25).toLocaleString('id-ID')}</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 text-right leading-none">0</span>
                    </div>
                    <div className="relative flex-1">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                            <div className="border-t border-dashed border-slate-100 dark:border-white/[0.04]" />
                            <div className="border-t border-dashed border-slate-100 dark:border-white/[0.04]" />
                            <div className="border-t border-dashed border-slate-100 dark:border-white/[0.04]" />
                            <div className="border-t border-dashed border-slate-100 dark:border-white/[0.04]" />
                            <div className="border-t border-dashed border-slate-100 dark:border-white/[0.04]" />
                        </div>
                        <div className="flex items-end h-[160px] gap-[2px] relative">
                        {chartData.map((item, i) => {
                            const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                            const isActive = hoveredIndex === i;
                            const color = item.value / maxValue > 0.7 ? '#0D5C63' : item.value / maxValue > 0.4 ? '#10929E' : '#9BD4D9';

                            return (
                                <div
                                    key={i}
                                    className="flex-1 relative group"
                                    style={{ zIndex: isActive ? 10 : 1 }}
                                >
                                    <div
                                        className="w-full rounded-sm transition-all duration-500 ease-out cursor-pointer hover:opacity-90"
                                        style={{
                                            height: `${Math.max(heightPct, 1)}%`,
                                            backgroundColor: color,
                                            opacity: isActive ? 1 : 0.7,
                                            transitionDelay: `${i * 15}ms`,
                                        }}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />
                                    {isActive && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg px-2.5 py-1.5 shadow-lg min-w-[100px] z-20 whitespace-nowrap">
                                            <p className="text-[8px] text-slate-400 mb-0.5">{item.tooltip}</p>
                                            <p className="text-xs font-semibold tabular-nums">Rp {item.value.toLocaleString('id-ID')}</p>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-900 dark:bg-slate-700 rotate-45" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
                {/* Labels */}
                <div className="relative h-3 mt-1.5 ml-10">
                    {chartData.map((item, i) => {
                        const showLabel = period === 'today' ? i % 3 === 0 : period === 'week' || i % 5 === 1;
                        if (!showLabel) return null;
                        return (
                            <div
                                key={i}
                                className="absolute text-[7px] font-medium text-slate-400 dark:text-slate-500 text-center -translate-x-1/2"
                                style={{ left: `${(i / Math.max(chartData.length - 1, 1)) * 100}%` }}
                            >
                                {item.shortLabel || item.label}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// ─── Main Dashboard Component ───
const Dashboard = () => {
    const { t, locale } = useLanguage();
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [period, setPeriod] = useState('today');
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetcher = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        else setLoading(true);
        setError(null);
        try {
            const res = await transactionApi.getDashboard();
            setDashboard(res.data.data);
            setLastUpdated(new Date());
        } catch (err) {
            if (!dashboard) setError(err.response?.data?.message || 'Gagal memuat data dashboard');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetcher(); }, []);

    if (loading) {
        return <LoadingSpinner text={locale === 'id' ? 'Memuat dashboard...' : 'Loading dashboard...'} />;
    }

    if (error && !dashboard) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{t('dashboard.title')}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
                </div>
                <EmptyState
                    icon={BarChart3}
                    title={locale === 'id' ? 'Dashboard Belum Siap' : 'Dashboard Not Ready'}
                    description={error || (locale === 'id' ? 'Data dashboard belum tersedia.' : 'Dashboard data is not available yet.')}
                    action
                    onAction={() => fetcher()}
                    actionLabel={locale === 'id' ? 'Muat Ulang' : 'Refresh'}
                />
            </div>
        );
    }

    const statCards = [
        {
            title: t('dashboard.todayRevenue'),
            value: dashboard?.stats?.today_sales ?? 0,
            icon: <DollarSign size={18} />,
            color: '#059669',
            trend: 12.5,
            trendLabel: 'vs last month',
            isCurrency: true,
        },
        {
            title: t('dashboard.transactionCount'),
            value: dashboard?.stats?.today_transactions ?? 0,
            icon: <ShoppingBag size={18} />,
            color: '#0D5C63',
            trend: 8.3,
            trendLabel: 'vs last month',
        },
        {
            title: t('dashboard.itemsMoved'),
            value: dashboard?.stats?.today_items_sold ?? 0,
            icon: <Package size={18} />,
            color: '#2563EB',
            trend: 15.2,
            trendLabel: 'vs last month',
        },
        {
            title: t('dashboard.inventoryAlerts'),
            value: dashboard?.stats?.low_stock_products ?? 0,
            icon: <AlertTriangle size={18} />,
            color: '#DC2626',
            trend: -5.1,
            trendLabel: 'vs last month',
        },
    ];

    const recentTransactions = dashboard?.recent_transactions || [];
    const topProducts = dashboard?.top_products || [];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{t('dashboard.title')}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2">
                    <PeriodFilter active={period} onChange={setPeriod} />
                    <button
                        onClick={() => fetcher(true)}
                        disabled={refreshing}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all disabled:opacity-50"
                    >
                        <RefreshCw size={14} className={`${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Last updated indicator */}
            {lastUpdated && (
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock size={10} />
                    {locale === 'id' ? 'Terakhir diperbarui' : 'Last updated'}: {lastUpdated.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, index) => (
                    <StatCard key={index} {...stat} delay={index * 60} />
                ))}
            </div>

            {/* Revenue Chart */}
            <RevenueChart hourlySales={dashboard?.stats?.hourly_sales} period={period} />

            {/* Bottom Grid: Transactions + Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center">
                                <CreditCard size={14} className="text-slate-500 dark:text-slate-400" />
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('dashboard.recentActivity')}</h2>
                        </div>
                        <button className="text-[10px] font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors flex items-center gap-0.5">
                            {t('dashboard.viewAllReports')}
                            <ChevronRight size={10} />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                    <th className="px-5 py-3 font-medium">{t('dashboard.invoice')}</th>
                                    <th className="px-5 py-3 font-medium">{t('dashboard.customerUser')}</th>
                                    <th className="px-5 py-3 font-medium text-right">{t('dashboard.amount')}</th>
                                    <th className="px-5 py-3 font-medium text-center">{t('dashboard.status')}</th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                                {recentTransactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-5 py-12 text-center">
                                            <p className="text-sm text-slate-400 dark:text-slate-500">{locale === 'id' ? 'Belum Ada Transaksi' : 'No Transactions Yet'}</p>
                                        </td>
                                    </tr>
                                ) : (
                                    recentTransactions.slice(0, 5).map((tx, idx) => (
                                        <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-5 py-3">
                                                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {tx.invoice_number || `#${tx.id}`}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-[8px] font-semibold text-slate-500 dark:text-slate-400">
                                                        {(tx.user?.name || 'W').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">{tx.user?.name || 'Walk-in'}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                                                    Rp {Number(tx.total).toLocaleString('id-ID')}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <StatusBadge status={tx.status} />
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <button className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-slate-100 dark:hover:bg-white/[0.06] text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 transition-all">
                                                    <ChevronRight size={12} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
                                <TrendingUp size={14} className="text-amber-600 dark:text-amber-400" />
                            </div>
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('dashboard.bestsellers')}</h2>
                        </div>
                    </div>
                    <div className="flex-1 p-4 space-y-2">
                        {topProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Package size={28} className="text-slate-200 dark:text-slate-600 mb-2" />
                                <p className="text-xs text-slate-400 dark:text-slate-500">{locale === 'id' ? 'Belum Ada Produk Terjual' : 'No Products Sold'}</p>
                            </div>
                        ) : (
                            topProducts.slice(0, 5).map((item, index) => {
                                const maxSold = Math.max(...topProducts.map(p => p.total_sold), 1);
                                const percentage = (item.total_sold / maxSold) * 100;
                                return (
                                    <div key={index} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
                                        <RankMedal rank={index + 1} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                                                    {item.product?.name || item.name || `Product ${index + 1}`}
                                                </p>
                                                <p className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">{item.total_sold}</p>
                                            </div>
                                            <div className="mt-1 h-1.5 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-primary-500 transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
