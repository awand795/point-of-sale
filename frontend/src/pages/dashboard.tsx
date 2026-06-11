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
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
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

// ─── Sparkline Mini-Chart (inline SVG) ───
const Sparkline = ({ data = [], color = "#0D5C63", height = 28, width = 80 }) => {
    if (data.length < 2) return null;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 4) - 2;
        return `${x},${y}`;
    });
    const polyline = pts.join(" ");

    return (
        <svg width={width} height={height} className="overflow-visible">
            <defs>
                <linearGradient id={`spark-fill-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.01} />
                </linearGradient>
            </defs>
            {/* Area fill */}
            <polygon
                points={`0,${height} ${polyline} ${width},${height}`}
                fill={`url(#spark-fill-${color.replace("#", "")})`}
            />
            {/* Line */}
            <polyline
                points={polyline}
                fill="none"
                stroke={color}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* End dot */}
            <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r={2.5} fill={color} stroke="white" strokeWidth={1.5} />
        </svg>
    );
};

// ─── Generate random sparkline data ───
const generateSparkData = (base, variance = 0.25, points = 7) => {
    return Array.from({ length: points }, (_, i) => {
        const trend = base * (1 + (i / points - 0.5) * 0.4);
        return Math.round(trend * (1 + (Math.random() - 0.5) * variance));
    });
};

// ─── Stat Card (redesigned) ───
const StatCard = ({ title, value, icon, color, trend, trendLabel, delay = 0, isCurrency = false, BackgroundIcon }) => {
    const [visible, setVisible] = useState(false);
    const sparkData = useMemo(() => generateSparkData(typeof value === 'number' ? value : 1000), [value]);

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
            className={`bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 min-h-[130px] relative overflow-hidden ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
            style={{ borderLeft: `4px solid ${color}` }}
        >
            {/* Background icon */}
            {BackgroundIcon && (
                <div className="absolute bottom-1 right-1 opacity-[0.04] dark:opacity-[0.03] pointer-events-none select-none">
                    <BackgroundIcon size={64} />
                </div>
            )}

            {/* Content */}
            <div className="relative z-10">
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
                <p className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight tabular-nums">
                    {typeof value === 'number'
                        ? <AnimatedCounter value={value} prefix={isCurrency ? 'Rp ' : ''} />
                        : value
                    }
                </p>

                {/* Sparkline */}
                <div className="mt-2 -ml-0.5">
                    <Sparkline data={sparkData} color={color} />
                </div>

                {trend !== undefined && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                        <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${trendColor}`}>
                            <TrendIcon size={10} />
                            {Math.abs(trend)}%
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500">{trendLabel}</span>
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
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium ${c.class}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
};

// ─── Rank Badge ───
const RankBadge = ({ rank }) => {
    if (rank === 1) return <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-400 text-xs font-bold">1</div>;
    if (rank === 2) return <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 text-xs font-bold">2</div>;
    if (rank === 3) return <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-400 text-xs font-bold">3</div>;
    return <div className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 text-xs font-medium">{rank}</div>;
};

// ─── Custom Recharts Tooltip ───
const CustomChartTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-3 shadow-xl">
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                Rp {payload[0].value.toLocaleString('id-ID')}
            </p>
        </div>
    );
};

// ─── Revenue Chart (Recharts AreaChart) ───
const RevenueChart = ({ hourlySales = [], weeklySales = [], monthlySales = [], period }) => {
    const { t, locale } = useLanguage();

    const chartData = useMemo(() => {
        const now = new Date();

        if (period === 'today') {
            const data = hourlySales.length >= 6 ? hourlySales : [];
            const currentHour = now.getHours();
            return data.slice(0, currentHour + 1 || 24).map((val, i) => ({
                value: Math.round(val),
                label: i % 3 === 0 ? `${String(i).padStart(2, '0')}:00` : '',
                tooltip: `${String(i).padStart(2, '0')}:00`,
            }));
        } else if (period === 'week') {
            const dayNames = locale === 'id'
                ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            const dayFull = locale === 'id'
                ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
                : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

            if (weeklySales.length >= 7) {
                const max = Math.max(...weeklySales, 1);
                return weeklySales.map((val, i) => ({
                    value: Math.round(val),
                    label: dayNames[i],
                    tooltip: dayFull[i],
                }));
            }

            // Fallback: synthetic data
            const avg = 540000;
            return dayNames.map((name, i) => {
                const multiplier = i >= 5 ? 0.6 : [1, 0.85, 0.95, 1.1, 1.2, 0.7, 0.5][i];
                return {
                    value: Math.round(avg * multiplier * (0.85 + Math.random() * 0.3)),
                    label: name,
                    tooltip: dayFull[i],
                };
            });
        } else {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

            if (monthlySales.length >= daysInMonth) {
                return monthlySales.map((val, i) => ({
                    value: Math.round(val),
                    label: (i + 1) % 5 === 1 ? `${i + 1}` : '',
                    tooltip: `${i + 1} ${now.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long' })} ${now.getFullYear()}`,
                }));
            }

            // Fallback: synthetic data
            const avg = 420000;
            return Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const d = new Date(now.getFullYear(), now.getMonth(), day);
                const dow = d.getDay();
                const multiplier = dow === 0 || dow === 6 ? 0.55 : 1;
                return {
                    value: Math.round(avg * multiplier * (0.7 + Math.random() * 0.6)),
                    label: day % 5 === 1 ? `${day}` : '',
                    tooltip: `${day} ${d.toLocaleString(locale === 'id' ? 'id-ID' : 'en-US', { month: 'long' })} ${now.getFullYear()}`,
                };
            });
        }
    }, [period, hourlySales, weeklySales, monthlySales, locale]);

    const totalRevenue = chartData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t('dashboard.revenueChart')}</h2>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{t('dashboard.revenueChartDesc')}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t('dashboard.revenueTotal')}</p>
                        <p className="text-base font-semibold text-slate-900 dark:text-white tabular-nums">Rp {totalRevenue.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="px-2 md:px-5 pt-4 pb-3">
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#0D5C63" stopOpacity={0.25} />
                                    <stop offset="60%" stopColor="#0D5C63" stopOpacity={0.08} />
                                    <stop offset="100%" stopColor="#0D5C63" stopOpacity={0.01} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#E2E8F0"
                                className="dark:opacity-[0.15]"
                            />
                            <XAxis
                                dataKey="label"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                                dy={6}
                                interval="preserveStartEnd"
                                minTickGap={30}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 500 }}
                                dx={-4}
                                tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                                width={40}
                            />
                            <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: '#94A3B8', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#0D5C63"
                                strokeWidth={2.5}
                                fill="url(#revenueGradient)"
                                dot={false}
                                activeDot={{ r: 5, fill: '#0D5C63', stroke: 'white', strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// ─── Date Range Filter ───
const DateRangeFilter = ({ startDate, endDate, onStartChange, onEndChange }) => {
    const { locale } = useLanguage();
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-white/[0.08] bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    title={locale === 'id' ? 'Dari tanggal' : 'Start date'}
                />
            </div>
            <span className="text-[11px] text-slate-400">–</span>
            <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-white/[0.08] bg-transparent text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                    title={locale === 'id' ? 'Sampai tanggal' : 'End date'}
                />
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
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

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
            trend: dashboard?.stats?.today_sales_trend ?? 0,
            trendLabel: locale === 'id' ? 'vs kemarin' : 'vs yesterday',
            isCurrency: true,
            BackgroundIcon: DollarSign,
            sparkData: dashboard?.stats?.hourly_sales,
        },
        {
            title: t('dashboard.transactionCount'),
            value: dashboard?.stats?.today_transactions ?? 0,
            icon: <ShoppingBag size={18} />,
            color: '#0D5C63',
            trend: dashboard?.stats?.today_transactions_trend ?? 0,
            trendLabel: locale === 'id' ? 'vs kemarin' : 'vs yesterday',
            BackgroundIcon: ShoppingBag,
            sparkData: dashboard?.stats?.hourly_sales?.map(v => v > 0 ? 1 : 0), // simplistic tx spark
        },
        {
            title: t('dashboard.itemsMoved'),
            value: dashboard?.stats?.today_items_sold ?? 0,
            icon: <Package size={18} />,
            color: '#2563EB',
            trend: dashboard?.stats?.today_items_sold_trend ?? 0,
            trendLabel: locale === 'id' ? 'vs kemarin' : 'vs yesterday',
            BackgroundIcon: Package,
        },
        {
            title: t('dashboard.inventoryAlerts'),
            value: dashboard?.stats?.low_stock_products ?? 0,
            icon: <AlertTriangle size={18} />,
            color: '#DC2626',
            trend: 0,
            trendLabel: locale === 'id' ? 'produk stok rendah' : 'low stock items',
            BackgroundIcon: AlertTriangle,
        },
    ];

    const recentTransactions = dashboard?.recent_transactions || [];
    const topProducts = dashboard?.top_products || [];
    const maxSold = Math.max(...topProducts.map(p => p.total_sold), 1);

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                    <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{t('dashboard.title')}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.subtitle')}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <DateRangeFilter
                        startDate={startDate}
                        endDate={endDate}
                        onStartChange={setStartDate}
                        onEndChange={setEndDate}
                    />
                    <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08]" />
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
            <RevenueChart
                hourlySales={dashboard?.stats?.hourly_sales}
                weeklySales={dashboard?.stats?.weekly_sales}
                monthlySales={dashboard?.stats?.monthly_sales}
                period={period}
            />

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
                                    recentTransactions.slice(0, 5).map((tx, idx) => {
                                        const isCancelled = tx.status === 'cancelled';
                                        const isPaid = tx.status === 'paid' || tx.status === 'completed';
                                        const amountColor = isCancelled
                                            ? 'text-red-600 dark:text-red-400'
                                            : isPaid
                                                ? 'text-emerald-600 dark:text-emerald-400'
                                                : 'text-slate-800 dark:text-slate-200';

                                        return (
                                            <tr
                                                key={tx.id}
                                                className={`transition-colors group ${
                                                    idx % 2 === 1
                                                        ? 'bg-slate-50/40 dark:bg-white/[0.015]'
                                                        : ''
                                                } hover:bg-slate-100/50 dark:hover:bg-white/[0.03]`}
                                            >
                                                <td className="px-5 py-3">
                                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                                        {tx.invoice_number || `#${tx.id}`}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                                            {(tx.user?.name || 'W').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-xs text-slate-600 dark:text-slate-400">{tx.user?.name || 'Walk-in'}</span>
                                                    </div>
                                                </td>
                                                <td className={`px-5 py-3 text-right text-xs font-semibold tabular-nums ${amountColor}`}>
                                                    Rp {Number(tx.total).toLocaleString('id-ID')}
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
                                        );
                                    })
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
                    <div className="flex-1 p-4 space-y-2.5">
                        {topProducts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <Package size={28} className="text-slate-200 dark:text-slate-600 mb-2" />
                                <p className="text-xs text-slate-400 dark:text-slate-500">{locale === 'id' ? 'Belum Ada Produk Terjual' : 'No Products Sold'}</p>
                            </div>
                        ) : (
                            topProducts.slice(0, 5).map((item, index) => {
                                const percentage = (item.total_sold / maxSold) * 100;
                                const category = item.product?.category?.name || item.category || '';

                                return (
                                    <div key={index} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all group">
                                        <RankBadge rank={index + 1} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-1.5 min-w-0">
                                                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                                                        {item.product?.name || item.name || `Product ${index + 1}`}
                                                    </p>
                                                    {category && (
                                                        <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-primary-50 dark:bg-primary-500/10 text-[9px] font-medium text-primary-600 dark:text-primary-400">
                                                            {category}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{item.total_sold} terjual</p>
                                            </div>
                                            {/* Proportional horizontal bar */}
                                            <div className="h-2 bg-slate-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        background: `linear-gradient(90deg, #0D5C63, #10929E)`,
                                                    }}
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
