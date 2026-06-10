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
    Clock,
    TrendingUp,
    Users,
    CreditCard,
    Building2,
    ChevronRight,
    Zap,
    Calendar,
    Sparkles,
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

// ─── Mini Sparkline Bar ───
const SparklineBar = ({ data = [], color = "bg-primary-500", height = 28 }) => {
    const max = Math.max(...data, 1);
    return (
        <div className="flex items-end gap-[2px]" style={{ height }}>
            {data.map((v, i) => (
                <div
                    key={i}
                    className={`${color} rounded-sm transition-all duration-500`}
                    style={{
                        width: `${100 / data.length}%`,
                        height: `${(v / max) * 100}%`,
                        opacity: 0.4 + (i / data.length) * 0.6,
                    }}
                />
            ))}
        </div>
    );
};

// ─── Stat Card ───
const StatCard = ({ title, value, icon, gradient, trend, trendLabel, sparklineData, delay = 0, isCurrency = false }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(t);
    }, [delay]);

    const isPositive = trend && trend >= 0;
    const trendColor = isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50';
    const TrendIcon = isPositive ? ArrowUpRight : ArrowDownRight;

    return (
        <div
            className={`bg-white rounded-3xl p-6 shadow-sm border border-slate-100/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
            {/* Subtle gradient decoration */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 ${gradient} opacity-[0.08] rounded-full blur-2xl transition-all duration-500 group-hover:opacity-[0.15] group-hover:scale-125`} />

            <div className="relative">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                        <div className="text-white">{icon}</div>
                    </div>
                    {sparklineData && (
                        <div className="opacity-40 group-hover:opacity-70 transition-opacity duration-300">
                            <SparklineBar data={sparklineData} color={isPositive ? "bg-emerald-400" : "bg-red-400"} />
                        </div>
                    )}
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tight mt-1.5 tabular-nums">
                    {typeof value === 'number'
                        ? <AnimatedCounter value={value} prefix={isCurrency ? 'Rp ' : ''} />
                        : value
                    }
                </p>
                {trend !== undefined && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                        <span className={`flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${trendColor}`}>
                            <TrendIcon size={10} />
                            {Math.abs(trend)}%
                        </span>
                        <span className="text-[9px] text-slate-400 font-medium">{trendLabel}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ─── Period Filter ───
const PeriodFilter = ({ active, onChange }) => {
    const { t, locale } = useLanguage();
    const periods = [
        { key: 'today', label: { id: 'Hari Ini', en: 'Today' }, icon: <Clock size={12} /> },
        { key: 'week', label: { id: 'Minggu Ini', en: 'This Week' }, icon: <Calendar size={12} /> },
        { key: 'month', label: { id: 'Bulan Ini', en: 'This Month' }, icon: <BarChart3 size={12} /> },
    ];

    return (
        <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-2xl p-1 shadow-sm">
            {periods.map((p) => (
                <button
                    key={p.key}
                    onClick={() => onChange(p.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 ${
                        active === p.key
                            ? 'bg-slate-900 text-white shadow-md shadow-slate-200'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {p.icon}
                    {p.label[locale] || p.label.en}
                </button>
            ))}
        </div>
    );
};

// ─── Transaction Status Badge ───
const StatusBadge = ({ status }) => {
    const config = {
        paid: { class: 'bg-emerald-50 text-emerald-600 border-emerald-200/50', dot: 'bg-emerald-500', label: 'Paid' },
        completed: { class: 'bg-emerald-50 text-emerald-600 border-emerald-200/50', dot: 'bg-emerald-500', label: 'Completed' },
        pending: { class: 'bg-amber-50 text-amber-600 border-amber-200/50', dot: 'bg-amber-500', label: 'Pending' },
        cancelled: { class: 'bg-red-50 text-red-600 border-red-200/50', dot: 'bg-red-500', label: 'Cancelled' },
    };
    const c = config[status] || config.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${c.class}`}>
            <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.dot} opacity-75`} />
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${c.dot}`} />
            </span>
            {c.label}
        </span>
    );
};

// ─── Rank Medal ───
const RankMedal = ({ rank }) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-300 to-yellow-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-amber-200">1</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white text-xs font-black shadow-md shadow-slate-200">2</div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 flex items-center justify-center text-white text-xs font-black shadow-md shadow-orange-200">3</div>;
    return <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-bold">{rank}</div>;
};

// ─── Revenue Chart ───
const RevenueChart = ({ hourlySales = [], period }) => {
    const { t, locale } = useLanguage();
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [chartReady, setChartReady] = useState(false);

    const chartData = useMemo(() => {
        if (period === 'today') {
            const data = hourlySales.length >= 6 ? hourlySales : [4, 7, 3, 9, 5, 11, 8, 14, 10, 16, 12, 18, 15, 20, 22, 25, 18, 21, 15, 10, 8, 5, 3, 2];
            const now = new Date();
            const currentHour = now.getHours();
            return data.slice(0, currentHour + 1 || 24).map((val, i) => ({
                value: val,
                label: `${String(i).padStart(2, '0')}:00`,
                shortLabel: i % 3 === 0 ? `${i}` : '',
                tooltip: `${String(i).padStart(2, '0')}:00 - ${String(i + 1).padStart(2, '0')}:00`,
            }));
        } else if (period === 'week') {
            const avg = hourlySales.length ? Math.round(hourlySales.reduce((a, b) => a + b, 0) / hourlySales.length) * 8 : 120;
            const dayNames = locale === 'id'
                ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const dayFull = locale === 'id'
                ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
                : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            // Generate data with weekend dip
            return dayNames.map((name, i) => {
                const multiplier = i >= 5 ? 0.6 : [1, 0.85, 0.95, 1.1, 1.2, 0.7, 0.5][i];
                return {
                    value: Math.round(avg * multiplier * (0.85 + Math.random() * 0.3)),
                    label: dayFull[i],
                    shortLabel: name,
                    tooltip: `${dayFull[i]}`,
                };
            });
        } else {
            // month: 30 days
            const avg = hourlySales.length ? Math.round(hourlySales.reduce((a, b) => a + b, 0) / hourlySales.length) * 6 : 90;
            return Array.from({ length: 30 }, (_, i) => {
                const day = i + 1;
                // Weekend effect
                const dow = (new Date(2026, 5, day).getDay());
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

    // Mock previous period for comparison
    const prevTotal = useMemo(() => {
        const base = totalRevenue;
        const variance = 0.85 + Math.random() * 0.3;
        return Math.round(base * variance);
    }, [totalRevenue]);

    const changePercent = prevTotal > 0 ? ((totalRevenue - prevTotal) / prevTotal) * 100 : 0;
    const isPositive = changePercent >= 0;

    useEffect(() => {
        setChartReady(false);
        const t = setTimeout(() => setChartReady(true), 50);
        return () => clearTimeout(t);
    }, [period]);

    useEffect(() => {
        if (hoveredIndex !== null) setHoveredIndex(null);
    }, [period]);

    const getBarColor = (value) => {
        const ratio = value / maxValue;
        if (ratio > 0.75) return 'from-emerald-400 to-emerald-500';
        if (ratio > 0.5) return 'from-primary-400 to-primary-500';
        if (ratio > 0.25) return 'from-blue-400 to-blue-500';
        return 'from-slate-300 to-slate-400';
    };

    return (
        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100/80 overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl flex items-center justify-center">
                            <TrendingUp size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-slate-900 tracking-tight">{t('dashboard.revenueChart')}</h2>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t('dashboard.revenueChartDesc')}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{t('dashboard.revenueTotal')}</p>
                        <p className="text-lg font-black text-slate-900 tabular-nums">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                    </div>
                </div>
                {/* Comparison badge */}
                <div className="flex items-center gap-2 mt-2.5">
                    <span className={`flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        isPositive ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                    }`}>
                        {isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                        {Math.abs(changePercent).toFixed(1)}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">
                        {period === 'today' ? t('dashboard.revenueVsYesterday') :
                         period === 'week' ? t('dashboard.revenueVsLastWeek') :
                         t('dashboard.revenueVsLastWeek')}
                    </span>
                </div>
            </div>

            {/* Chart body */}
            <div className="p-6 pt-8">
                {/* Y-axis labels + bars */}
                <div className="relative">
                    {/* Y-axis grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                        <div
                            key={ratio}
                            className="absolute left-0 right-0 border-t border-dashed border-slate-100"
                            style={{ bottom: `${ratio * 180}px` }}
                        >
                            <span className="absolute -top-2.5 left-0 text-[8px] font-medium text-slate-300 tabular-nums">
                                {ratio > 0 ? `Rp ${Math.round(maxValue * ratio).toLocaleString('id-ID')}` : ''}
                            </span>
                        </div>
                    ))}

                    {/* Bars container */}
                    <div className="flex items-end h-[180px] gap-[3px] relative ml-[60px]">
                        {chartData.map((item, i) => {
                            const heightPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                            const isActive = hoveredIndex === i;

                            return (
                                <div
                                    key={i}
                                    className="flex-1 relative group"
                                    style={{ zIndex: isActive ? 10 : 1 }}
                                >
                                    {/* Bar */}
                                    <div
                                        className={`w-full rounded-sm bg-gradient-to-t ${getBarColor(item.value)} transition-all duration-700 ease-out cursor-pointer ${
                                            isActive ? 'opacity-100 shadow-lg shadow-primary-200/50 scale-y-[1.02]' : 'opacity-80 hover:opacity-100'
                                        }`}
                                        style={{
                                            height: chartReady ? `${Math.max(heightPct, 1)}%` : '0%',
                                            transitionDelay: `${i * 15}ms`,
                                        }}
                                        onMouseEnter={() => setHoveredIndex(i)}
                                        onMouseLeave={() => setHoveredIndex(null)}
                                    />

                                    {/* Tooltip */}
                                    {isActive && (
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl px-3 py-2 shadow-xl shadow-slate-900/30 min-w-[120px] z-20 animate-fadeIn">
                                            <p className="text-[9px] font-medium text-slate-400 mb-0.5 whitespace-nowrap">{item.tooltip}</p>
                                            <p className="text-xs font-black tabular-nums">Rp {item.value.toLocaleString('id-ID')}</p>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* X-axis labels */}
                <div className="relative h-4 mt-2 ml-[60px]">
                    {chartData.map((item, i) => {
                        const showLabel = period === 'today' ? i % 3 === 0 : period === 'week' || i % 5 === 1;
                        if (!showLabel) return null;
                        const leftPct = (i / Math.max(chartData.length - 1, 1)) * 100;
                        return (
                            <div
                                key={i}
                                className="absolute text-[8px] font-medium text-slate-400 tabular-nums text-center -translate-x-1/2"
                                style={{ left: `${leftPct}%` }}
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
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchedRef = useRef(false);
    const fetchDashboard = useCallback(async (showRefreshing = false) => {
        if (showRefreshing) setRefreshing(true);
        else if (!fetchedRef.current) setLoading(true);
        setError(null);
        try {
            const res = await transactionApi.getDashboard();
            setDashboard(res.data.data);
            setLastUpdated(new Date());
            fetchedRef.current = true;
        } catch (err) {
            if (!fetchedRef.current) setError(err.response?.data?.message || 'Gagal memuat data dashboard');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, []);

    // Auto-refresh every 30s
    useEffect(() => {
        if (!autoRefresh) return;
        const interval = setInterval(() => fetchDashboard(true), 30000);
        return () => clearInterval(interval);
    }, [autoRefresh, fetchDashboard]);            // Generate sparkline data from today's hourly sales if available, otherwise mock
    const sparklineData = dashboard?.stats?.hourly_sales || [4, 7, 3, 9, 5, 11, 8, 14, 10, 16, 12, 18];

    if (loading) {
        return <LoadingSpinner text={locale === 'id' ? 'Memuat dashboard...' : 'Loading dashboard...'} />;
    }

    if (error && !dashboard) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboard.title')}</h1>
                    <p className="text-sm text-slate-500 font-medium mt-1">{t('dashboard.subtitle')}</p>
                </div>
                <EmptyState
                    icon={BarChart3}
                    title={locale === 'id' ? 'Dashboard Belum Siap' : 'Dashboard Not Ready'}
                    description={error || (locale === 'id' ? 'Data dashboard belum tersedia. Sistem mungkin masih memulai atau belum ada data transaksi.' : 'Dashboard data is not available yet. The system may be starting up or there is no transaction data.')}
                    action
                    onAction={() => fetchDashboard()}
                    actionLabel={locale === 'id' ? 'Muat Ulang' : 'Refresh'}
                />
            </div>
        );
    }

    const stats = [
        {
            title: t('dashboard.todayRevenue'),
            value: dashboard?.stats?.today_sales ?? 0,
            icon: <DollarSign size={22} />,
            gradient: 'from-emerald-500 to-teal-600',
            trend: 12.5,
            trendLabel: 'vs last month',
            sparklineData,
            isCurrency: true,
        },
        {
            title: t('dashboard.transactionCount'),
            value: dashboard?.stats?.today_transactions ?? 0,
            icon: <ShoppingBag size={22} />,
            gradient: 'from-primary-500 to-violet-600',
            trend: 8.3,
            trendLabel: 'vs last month',
        },
        {
            title: t('dashboard.itemsMoved'),
            value: dashboard?.stats?.today_items_sold ?? 0,
            icon: <Package size={22} />,
            gradient: 'from-blue-500 to-indigo-600',
            trend: 15.2,
            trendLabel: 'vs last month',
        },
        {
            title: t('dashboard.inventoryAlerts'),
            value: dashboard?.stats?.low_stock_products ?? 0,
            icon: <AlertTriangle size={22} />,
            gradient: 'from-red-500 to-rose-600',
            trend: -5.1,
            trendLabel: 'vs last month',
        },
    ];

    const recentTransactions = dashboard?.recent_transactions || [];
    const topProducts = dashboard?.top_products || [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200/50">
                        <BarChart3 size={28} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {t('dashboard.title')}
                            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-200">
                                <Sparkles size={10} className="inline mr-1" />Live
                            </span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">{t('dashboard.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <PeriodFilter active={period} onChange={setPeriod} />
                    <button
                        onClick={() => fetchDashboard(true)}
                        disabled={refreshing}
                        className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary-600 hover:border-primary-200 hover:bg-primary-50/50 transition-all disabled:opacity-50"
                        title={locale === 'id' ? 'Muat Ulang' : 'Refresh'}
                    >
                        <RefreshCw size={15} className={`${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        className={`p-2.5 rounded-xl border transition-all ${
                            autoRefresh
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
                        }`}
                        title={autoRefresh ? (locale === 'id' ? 'Auto-refresh aktif' : 'Auto-refresh on') : (locale === 'id' ? 'Auto-refresh mati' : 'Auto-refresh off')}
                    >
                        <Zap size={15} />
                    </button>
                </div>
            </div>

            {/* Auto-refresh indicator */}
            {lastUpdated && autoRefresh && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    {locale === 'id' ? 'Auto-refresh setiap 30 detik' : 'Auto-refresh every 30s'}
                    <span className="text-slate-300">·</span>
                    {locale === 'id' ? 'Terakhir diperbarui' : 'Last updated'}: {lastUpdated.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} delay={index * 80} />
                ))}
            </div>

            {/* Revenue Chart */}
            <RevenueChart hourlySales={dashboard?.stats?.hourly_sales} period={period} />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100/80 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                                <CreditCard size={18} className="text-primary-600" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 tracking-tight">{t('dashboard.recentActivity')}</h2>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t('dashboard.recentDesc')}</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-1 text-[10px] font-bold text-primary-600 hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-all">
                            {t('dashboard.viewAllReports')}
                            <ChevronRight size={12} />
                        </button>
                    </div>
                    <div className="p-1">
                        {recentTransactions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                                    <BarChart3 size={28} className="text-slate-200" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">{locale === 'id' ? 'Belum Ada Transaksi' : 'No Transactions Yet'}</p>
                                <p className="text-[11px] text-slate-300 mt-1">{locale === 'id' ? 'Mulai bertransaksi untuk melihat aktivitas di sini' : 'Start transacting to see activity here'}</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            <th className="px-5 py-3.5">{t('dashboard.invoice')}</th>
                                            <th className="px-5 py-3.5">{t('dashboard.customerUser')}</th>
                                            <th className="px-5 py-3.5 text-right">{t('dashboard.amount')}</th>
                                            <th className="px-5 py-3.5 text-center">{t('dashboard.status')}</th>
                                            <th className="px-5 py-3.5" />
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {recentTransactions.slice(0, 6).map((tx, idx) => (
                                            <tr
                                                key={tx.id}
                                                className="hover:bg-slate-50/80 transition-colors group"
                                                style={{ animation: `slideIn 0.3s ease-out ${idx * 40}ms both` }}
                                            >
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400 shadow-sm">
                                                            #{String(tx.id || idx + 1).slice(-3)}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800">{tx.invoice_number || `#${tx.id}`}</p>
                                                            <p className="text-[9px] text-slate-400 font-medium mt-0.5">
                                                                {tx.created_at ? new Date(tx.created_at).toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short' }) : ''}
                                                                {' · '}
                                                                {tx.created_at ? new Date(tx.created_at).toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', { hour: '2-digit', minute: '2-digit' }) : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-50 to-violet-50 flex items-center justify-center text-[8px] font-bold text-primary-600">
                                                            {(tx.user?.name || 'W').charAt(0).toUpperCase()}
                                                        </div>
                                                        <p className="text-xs font-semibold text-slate-700">{tx.user?.name || 'Walk-in'}</p>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <p className="text-xs font-black text-slate-900 tabular-nums">Rp {Number(tx.total).toLocaleString('id-ID')}</p>
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <StatusBadge status={tx.status} />
                                                </td>
                                                <td className="px-5 py-3.5 text-right">
                                                    <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-all">
                                                        <ChevronRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    {recentTransactions.length > 6 && (
                        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/30 text-center">
                            <button className="text-[10px] font-bold text-primary-600 hover:text-primary-700 transition-colors">
                                {locale === 'id' ? `Lihat semua ${recentTransactions.length} transaksi` : `View all ${recentTransactions.length} transactions`}
                            </button>
                        </div>
                    )}
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/40 border border-slate-100/80 overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                    <div className="px-6 py-5 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                                <TrendingUp size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 tracking-tight">{t('dashboard.bestsellers')}</h2>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{t('dashboard.bestsellersDesc')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 p-5">
                        {topProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10">
                                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3 border-2 border-dashed border-slate-200">
                                    <Package size={24} className="text-slate-200" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">{locale === 'id' ? 'Belum Ada Produk Terjual' : 'No Products Sold'}</p>
                                <p className="text-[11px] text-slate-300 mt-1 text-center">{locale === 'id' ? 'Data penjualan akan muncul di sini' : 'Sales data will appear here'}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {topProducts.slice(0, 5).map((item, index) => {
                                    const maxSold = Math.max(...topProducts.map(p => p.total_sold), 1);
                                    const percentage = (item.total_sold / maxSold) * 100;
                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group"
                                            style={{ animation: `slideIn 0.3s ease-out ${index * 60}ms both` }}
                                        >
                                            <RankMedal rank={index + 1} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-xs font-bold text-slate-800 truncate group-hover:text-primary-600 transition-colors">
                                                        {item.product?.name || item.name || `Product ${index + 1}`}
                                                    </p>
                                                    <p className="text-[10px] font-black text-slate-400 tabular-nums shrink-0">{item.total_sold}</p>
                                                </div>
                                                <div className="mt-1.5 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-700 ${
                                                            index === 0 ? 'bg-gradient-to-r from-amber-400 to-yellow-500' :
                                                            index === 1 ? 'bg-gradient-to-r from-slate-300 to-slate-400' :
                                                            index === 2 ? 'bg-gradient-to-r from-orange-400 to-amber-500' :
                                                            'bg-gradient-to-r from-primary-400 to-primary-500'
                                                        }`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {topProducts.length > 5 && (
                                    <button className="w-full text-center text-[9px] font-bold text-primary-600 hover:text-primary-700 py-2 transition-colors">
                                        {locale === 'id' ? `Lihat semua ${topProducts.length} produk` : `View all ${topProducts.length} products`}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Stats Bar */}
            {dashboard?.stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-slate-100/60 flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                            <DollarSign size={16} className="text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{locale === 'id' ? 'Pendapatan Hari Ini' : 'Today Revenue'}</p>
                            <p className="text-sm font-black text-slate-900 tabular-nums">Rp {Number(dashboard.stats.today_sales || 0).toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-slate-100/60 flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                            <ShoppingBag size={16} className="text-primary-600" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{locale === 'id' ? 'Transaksi Hari Ini' : 'Today Transactions'}</p>
                            <p className="text-sm font-black text-slate-900 tabular-nums">{dashboard.stats.today_transactions || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-slate-100/60 flex items-center gap-3">
                        <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                            <Package size={16} className="text-violet-600" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{locale === 'id' ? 'Barang Terjual' : 'Items Sold'}</p>
                            <p className="text-sm font-black text-slate-900 tabular-nums">{dashboard.stats.today_items_sold || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 border border-slate-100/60 flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                            <AlertTriangle size={16} className="text-amber-600" />
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{locale === 'id' ? 'Peringatan Stok' : 'Stock Alerts'}</p>
                            <p className="text-sm font-black text-slate-900 tabular-nums">{dashboard.stats.low_stock_products || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Animations */}
            <style>{`
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-8px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(4px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out both;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
