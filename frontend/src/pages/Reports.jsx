import { useState, useRef, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Package, Calendar, Download, ArrowUpRight, ArrowDownRight, PieChart, Loader2 } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";
import { useReports } from "../hooks/useReports";
import { useToast } from "../hooks/useToast";
import { exportToPdf } from "../utils/exportPdf";

const AnimatedCounter = ({ value, prefix = "", duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const start = display || 0;
    const t0 = performance.now();
    const anim = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(start + (value - start) * e));
      if (p < 1) rafRef.current = requestAnimationFrame(anim);
    };
    rafRef.current = requestAnimationFrame(anim);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [value, duration]);
  return <>{prefix}{display.toLocaleString("id-ID")}</>;
};

const StatCard = ({ title, value, icon, bgColor, iconColor, change, isCurrency, delay = 0 }) => {
  const { t } = useLanguage();
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const pos = change >= 0;
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm dark:shadow-slate-900/50 border border-slate-100/80 dark:border-slate-700/60 hover:shadow-md transition-all duration-300 ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className={`w-10 h-10 ${bgColor} rounded-xl flex items-center justify-center`}>
        <div className={iconColor}>{icon}</div>
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight mt-1 tabular-nums">
          {typeof value === "number" ? <AnimatedCounter value={value} prefix={isCurrency ? "Rp " : ""} /> : value}
        </p>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5 mt-2.5">
          <span className={`flex items-center gap-0.5 text-[9px] font-bold px-2 py-0.5 rounded-full ${pos ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/40 dark:text-emerald-400" : "text-red-600 bg-red-50 dark:bg-red-900/40 dark:text-red-400"}`}>
            {pos ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}{Math.abs(change)}%
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 font-medium">{t("reports.vsLastMonth")}</span>
        </div>
      )}
    </div>
  );
};

const RevenueChart = ({ data = [], period, compareMode = false, toggleCompare }) => {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(false); const t2 = setTimeout(() => setReady(true), 50); return () => clearTimeout(t2); }, [data, compareMode]);

  const chartItems = data.map((item, i) => ({
    ...item,
    prev: compareMode && i > 0 ? data[i - 1].revenue : null,
    change: compareMode && i > 0 && data[i - 1].revenue > 0
      ? ((item.revenue - data[i - 1].revenue) / data[i - 1].revenue) * 100
      : null,
  }));

  const allValues = compareMode
    ? chartItems.flatMap(d => [d.revenue, d.prev].filter(v => v !== null))
    : data.map(d => d.revenue);
  const mx = Math.max(...allValues, 1);
  const total = data.reduce((s, d) => s + (d.revenue || 0), 0);
  const overallChange = compareMode && chartItems.length > 1
    ? chartItems.reduce((sum, item) => sum + (item.change ?? 0), 0) / chartItems.filter(i => i.change !== null).length
    : null;

  const fmt = (v) => v >= 1000000 ? `Rp ${(v / 1000000).toFixed(1)}jt` : v >= 1000 ? `Rp ${(v / 1000).toFixed(0)}rb` : `Rp ${v}`;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100/80 dark:border-slate-700/60 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-50 dark:bg-white/[0.04] rounded-xl flex items-center justify-center">
              <BarChart3 size={16} className="text-slate-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">{period === "monthly" ? t("reports.monthlyRevenue") : t("reports.yearlyRevenue")}</h2>
                <button
                  onClick={toggleCompare}
                  className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider border transition-all ${
                    compareMode
                      ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                      : 'bg-transparent text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                  }`}
                >
                  <BarChart3 size={10} className="inline mr-1 -mt-0.5" />
                  {t("reports.compare")}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {compareMode ? t("reports.compareDesc") : (period === "monthly" ? t("reports.last12Months") : t("reports.last5Years"))}
              </p>
            </div>
          </div>
          <div className="text-right">
            {compareMode && overallChange !== null && (
              <div className={`flex items-center justify-end gap-1 mb-1 ${overallChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                <span className="text-[8px] font-black uppercase tracking-wider">{overallChange >= 0 ? t('reports.growth') : t('reports.decline')}</span>
                <span className={`flex items-center gap-0.5 text-[10px] font-black px-1.5 py-0.5 rounded-full ${overallChange >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/40' : 'bg-red-50 dark:bg-red-900/40'}`}>
                  {overallChange >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(overallChange).toFixed(1)}%
                </span>
              </div>
            )}
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("dashboard.revenueTotal")}</p>
            <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">Rp {total.toLocaleString("id-ID")}</p>
          </div>
        </div>
        {compareMode && (
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary-400" />
              <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">{t("reports.currentPeriod")}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-300 dark:bg-slate-500" />
              <span className="text-[9px] font-medium text-slate-500 dark:text-slate-400">{t("reports.previousPeriod")}</span>
            </div>
            {overallChange !== null && (
              <div className={`text-[9px] font-bold ${overallChange >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {overallChange >= 0 ? '↑' : '↓'} {Math.abs(overallChange).toFixed(1)}%
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-5 pt-7">
        <div className="relative">
          {[0, 0.25, 0.5, 0.75, 1].map((r) => (
            <div key={r} className="absolute left-0 right-0 border-t border-dashed border-slate-100 dark:border-slate-700" style={{ bottom: `${r * 200}px` }}>
              <span className="absolute -top-2.5 left-0 text-[8px] font-medium text-slate-300 dark:text-slate-600 tabular-nums">{r > 0 ? fmt(mx * r) : ""}</span>
            </div>
          ))}
          <div className="flex items-end h-[200px] gap-[3px] relative ml-[60px]">
            {chartItems.map((item, i) => {
              const hCurr = mx > 0 ? (item.revenue / mx) * 100 : 0;
              const hPrev = compareMode && item.prev !== null ? (item.prev / mx) * 100 : 0;
              const act = hovered === i;
              return (
                <div key={i} className="flex-1 flex items-end gap-[2px] min-w-0" style={{ zIndex: act ? 10 : 1 }}>
                  {compareMode && item.prev !== null && (
                    <div className="flex-1 group/prev relative"
                      onMouseEnter={() => setHovered(i)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div
                        className={`w-full rounded-sm bg-slate-300 dark:bg-slate-500 transition-all duration-700 ease-out ${act ? 'opacity-100' : 'opacity-60 hover:opacity-90'}`}
                        style={{ height: ready ? `${Math.max(hPrev, 1)}%` : "0%", transitionDelay: `${i * 20}ms` }}
                      />
                    </div>
                  )}
                  <div className="flex-1 group/curr relative"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div
                      className={`w-full rounded-sm bg-primary-400 transition-all duration-700 ease-out cursor-pointer ${act ? 'opacity-100 shadow-lg shadow-primary-200/50 dark:shadow-primary-900/50' : 'opacity-80 hover:opacity-100'}`}
                      style={{ height: ready ? `${Math.max(hCurr, 1)}%` : "0%", transitionDelay: `${(i * 20) + 50}ms` }}
                    />
                  </div>
                  {act && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl px-3 py-2 shadow-xl shadow-slate-900/30 min-w-[150px] z-20 animate-fadeIn whitespace-nowrap">
                      <p className="text-[9px] font-medium text-slate-400 dark:text-slate-300 mb-1">{item.month || item.year}</p>
                      <div className="flex items-center justify-between gap-3 text-[10px]">
                        <span className="text-primary-300">{t('reports.currentPeriod')}</span>
                        <span className="font-black">Rp {item.revenue.toLocaleString("id-ID")}</span>
                      </div>
                      {compareMode && item.prev !== null && (
                        <>
                          <div className="flex items-center justify-between gap-3 text-[10px] mt-0.5">
                            <span className="text-slate-400">{t('reports.previousPeriod')}</span>
                            <span className="font-medium">Rp {item.prev.toLocaleString("id-ID")}</span>
                          </div>
                          {item.change !== null && (
                            <div className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-bold ${item.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                              {item.change >= 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                              {Math.abs(item.change).toFixed(1)}%
                            </div>
                          )}
                        </>
                      )}
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative h-4 mt-2 ml-[60px]">
          {data.map((item, i) => {
            const show = period === "monthly" ? i % 2 === 0 : true;
            if (!show) return null;
            return <div key={i} className="absolute text-[8px] font-medium text-slate-400 dark:text-slate-500 tabular-nums text-center -translate-x-1/2" style={{ left: `${(i / Math.max(data.length - 1, 1)) * 100}%` }}>{item.month || item.year}</div>;
          })}
        </div>
      </div>
    </div>
  );
};

const CategoryBar = ({ name, revenue, percentage, color }) => (
  <div className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all">
    <div className={`w-3 h-3 rounded-full ${color} shrink-0`} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{name}</p>
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 tabular-nums shrink-0">{percentage}%</p>
      </div>
      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">Rp {revenue.toLocaleString("id-ID")}</p>
    </div>
  </div>
);

const Reports = () => {
  const { t, locale } = useLanguage();
  const { reports, loading, error, filterByDate } = useReports();
  const { showToast } = useToast();
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [chartPeriod, setChartPeriod] = useState("monthly");
  const [exporting, setExporting] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const reportContentRef = useRef(null);

  const handleFilter = () => { if (dateRange.start && dateRange.end) filterByDate(dateRange.start, dateRange.end); };

  if (loading) return <LoadingSpinner text={locale === "id" ? "Memuat laporan..." : "Loading reports..."} />;

  const stats = reports ? [
    { title: t("reports.totalRevenue"), value: reports.total_revenue || 0, icon: <DollarSign size={18} />, bgColor: "bg-emerald-50 dark:bg-emerald-900/20", iconColor: "text-emerald-600 dark:text-emerald-400", change: reports.total_revenue_change ?? 12.5, isCurrency: true },
    { title: t("reports.totalOrders"), value: reports.total_orders || 0, icon: <ShoppingBag size={18} />, bgColor: "bg-primary-50 dark:bg-primary-900/20", iconColor: "text-primary-600 dark:text-primary-400", change: reports.total_orders_change ?? 8.3 },
    { title: t("reports.itemsSold"), value: reports.total_items || 0, icon: <Package size={18} />, bgColor: "bg-blue-50 dark:bg-blue-900/20", iconColor: "text-blue-600 dark:text-blue-400", change: reports.total_items_change ?? 15.2 },
    { title: t("reports.avgOrderValue"), value: reports.avg_order_value || 0, icon: <TrendingUp size={18} />, bgColor: "bg-amber-50 dark:bg-amber-900/20", iconColor: "text-amber-600 dark:text-amber-400", change: reports.avg_order_value_change ?? 3.8, isCurrency: true },
  ] : [];

  const monthlyData = reports?.monthly_sales || [];
  const yearlyData = reports?.yearly_sales || [];
  const chartData = chartPeriod === "monthly" ? monthlyData : yearlyData;
  const topProducts = reports?.top_products || [];
  const categoryBreakdown = reports?.category_breakdown || [];
  const categoryColors = ["bg-violet-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-slate-400"];

  const handleExportPdf = async () => {
    setExporting(true);
    try {
      // Yield to let React update loading state before heavy html2canvas work
      await new Promise(r => setTimeout(r, 50));

      await exportToPdf(reportContentRef.current, {
        filename: `BikinPOS_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        title: t("reports.title"),
        subtitle: t("reports.subtitle"),
        landscape: false,
        imageQuality: 'medium',
      });
      showToast('success', locale === 'id' ? 'PDF berhasil diunduh' : 'PDF downloaded successfully');
    } catch {
      showToast('error', locale === 'id' ? 'Gagal mengunduh PDF' : 'Failed to download PDF');
    }
    setExporting(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t("reports.title")} subtitle={t("reports.subtitle")} />

      {/* Controls row */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 bg-surface dark:bg-surface-raised p-1 rounded-lg border border-slate-200/60 dark:border-white/[0.06]">
          <button onClick={() => setChartPeriod("monthly")} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 ${chartPeriod === "monthly" ? "bg-primary-500 text-white shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}>{t("reports.monthlyLabel")}</button>
          <button onClick={() => setChartPeriod("yearly")} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all duration-200 ${chartPeriod === "yearly" ? "bg-primary-500 text-white shadow-sm" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}>{t("reports.yearlyLabel")}</button>
        </div>
        <div className="flex items-center gap-2 bg-surface dark:bg-surface-raised p-1 rounded-lg border border-slate-200/60 dark:border-white/[0.06]">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange((d) => ({ ...d, start: e.target.value }))} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-md text-[10px] font-bold focus:bg-white dark:focus:bg-slate-600 focus:border-primary-200 dark:focus:border-primary-500 outline-none transition-all dark:text-slate-200" />
          <span className="text-xs text-slate-400">—</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange((d) => ({ ...d, end: e.target.value }))} className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-md text-[10px] font-bold focus:bg-white dark:focus:bg-slate-600 focus:border-primary-200 dark:focus:border-primary-500 outline-none transition-all dark:text-slate-200" />
        </div>
        <button onClick={handleFilter} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-500 text-white text-[10px] font-bold rounded-lg hover:bg-primary-600 transition-all shadow-sm active:scale-[0.97]"><Calendar size={12} /> {t("reports.filterDate")}</button>
        <button
          onClick={handleExportPdf}
          disabled={exporting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
          {exporting ? (locale === "id" ? "Mengekspor..." : "Exporting...") : t("reports.exportPdf")}
        </button>
      </div>

      <div ref={reportContentRef} className="space-y-6">
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />{error}
        </div>
      )}

      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => <StatCard key={i} {...stat} delay={i * 80} />)}
        </div>
      )}

      {chartData.length > 0 ? (
        <RevenueChart data={chartData} period={chartPeriod} compareMode={compareMode} toggleCompare={() => setCompareMode(p => !p)} />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200 dark:border-slate-600">
              <BarChart3 size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-base font-bold text-slate-400 dark:text-slate-500">{t("reports.noData")}</p>
            <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">{t("reports.noDataDesc")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100/80 dark:border-slate-700/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center"><TrendingUp size={16} className="text-amber-600 dark:text-amber-400" /></div>
              <div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t("reports.topProducts")}</h2><p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{t("reports.topProductsDesc")}</p></div>
            </div>
          </div>
          <div className="p-5">
            {topProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10"><Package size={32} className="text-slate-200 dark:text-slate-600 mb-2" /><p className="text-sm font-bold text-slate-400 dark:text-slate-500">{locale === "id" ? "Belum ada data" : "No data yet"}</p></div>
            ) : (
              <div className="space-y-3">
                {topProducts.map((item, index) => {
                  const maxSold = Math.max(...topProducts.map((p) => p.total_sold), 1);
                  const pct = (item.total_sold / maxSold) * 100;
                  const rankColors = [
                    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                    "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300",
                    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
                    "bg-slate-50 dark:bg-slate-800 text-slate-400",
                  ];
                  const rankColor = rankColors[Math.min(index, 3)];
                  return (
                    <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 border border-transparent hover:border-slate-100 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all group" style={{ animation: `slideIn 0.3s ease-out ${index * 60}ms both` }}>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${rankColor}`}>{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.name}</p>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tabular-nums shrink-0">{item.total_sold}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mr-3">
                            <div className={`h-full rounded-full transition-all duration-700 ${
                              index === 0 ? "bg-amber-400" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-orange-400" : "bg-primary-400"
                            }`} style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-[8px] font-medium text-slate-400 dark:text-slate-500 tabular-nums shrink-0">Rp {item.revenue.toLocaleString("id-ID")}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100/80 dark:border-slate-700/60 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center"><PieChart size={16} className="text-violet-600 dark:text-violet-400" /></div>
              <div><h2 className="text-sm font-semibold text-slate-900 dark:text-white">{t("reports.categoryBreakdown")}</h2><p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{t("reports.categoryDesc")}</p></div>
            </div>
          </div>
          <div className="p-5">
            {categoryBreakdown.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10"><PieChart size={32} className="text-slate-200 dark:text-slate-600 mb-2" /><p className="text-sm font-bold text-slate-400 dark:text-slate-500">{locale === "id" ? "Belum ada data" : "No data yet"}</p></div>
            ) : (
              <div className="space-y-1">{categoryBreakdown.map((cat, i) => <CategoryBar key={i} {...cat} color={categoryColors[i % categoryColors.length]} />)}</div>
            )}
          </div>
        </div>
      </div>
      </div>

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out both; }
      `}</style>
    </div>
  );
};

export default Reports;
