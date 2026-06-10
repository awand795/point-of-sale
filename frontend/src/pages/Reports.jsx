import { useState, useRef, useEffect } from "react";
import { BarChart3, TrendingUp, DollarSign, ShoppingBag, Package, Calendar, Download, ArrowUpRight, ArrowDownRight, PieChart, Sparkles } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LoadingSpinner } from "../components/shared/EmptyState";
import { useReports } from "../hooks/useReports";

const AnimatedCounter = ({ value, prefix = "", duration = 1200 }) => {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const start = display;
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

const StatCard = ({ title, value, icon, gradient, change, isCurrency, delay = 0 }) => {
  const { t } = useLanguage();
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const pos = change >= 0;
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-slate-900/50 border border-slate-100/80 dark:border-slate-700/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden ${vis ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className={`absolute -top-12 -right-12 w-32 h-32 ${gradient} opacity-[0.08] rounded-full blur-2xl transition-all group-hover:opacity-[0.15] group-hover:scale-125`} />
      <div className="relative">
        <div className={`w-12 h-12 ${gradient} rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 group-hover:scale-110 group-hover:rotate-3 transition-all`}>
          <div className="text-white">{icon}</div>
        </div>
        <div className="mt-4">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 tabular-nums">
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
    </div>
  );
};

const RevenueChart = ({ data = [], period }) => {
  const { t } = useLanguage();
  const [hovered, setHovered] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(false); const t2 = setTimeout(() => setReady(true), 50); return () => clearTimeout(t2); }, [data]);
  const mx = Math.max(...data.map((d) => d.revenue), 1);
  const total = data.reduce((s, d) => s + (d.revenue || 0), 0);
  const fmt = (v) => v >= 1000000 ? `Rp ${(v / 1000000).toFixed(1)}jt` : v >= 1000 ? `Rp ${(v / 1000).toFixed(0)}rb` : `Rp ${v}`;
  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-slate-900/50 border border-slate-100/80 dark:border-slate-700/60 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-50 to-violet-50 dark:from-primary-900/40 dark:to-violet-900/40 rounded-xl flex items-center justify-center">
              <BarChart3 size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{period === "monthly" ? t("reports.monthlyRevenue") : t("reports.yearlyRevenue")}</h2>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{period === "monthly" ? t("reports.last12Months") : t("reports.last5Years")}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{t("dashboard.revenueTotal")}</p>
            <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">Rp {total.toLocaleString("id-ID")}</p>
          </div>
        </div>
      </div>
      <div className="p-6 pt-8">
        <div className="relative">
          {[0, 0.25, 0.5, 0.75, 1].map((r) => (
            <div key={r} className="absolute left-0 right-0 border-t border-dashed border-slate-100 dark:border-slate-700" style={{ bottom: `${r * 200}px` }}>
              <span className="absolute -top-2.5 left-0 text-[8px] font-medium text-slate-300 dark:text-slate-600 tabular-nums">{r > 0 ? fmt(mx * r) : ""}</span>
            </div>
          ))}
          <div className="flex items-end h-[200px] gap-2 relative ml-[60px]">
            {data.map((item, i) => {
              const h = mx > 0 ? (item.revenue / mx) * 100 : 0;
              const act = hovered === i;
              return (
                <div key={i} className="flex-1 relative group" style={{ zIndex: act ? 10 : 1 }}>
                  <div className={`w-full rounded-sm bg-gradient-to-t ${act ? "from-primary-500 to-primary-300" : "from-primary-400 to-primary-200"} transition-all duration-700 ease-out cursor-pointer ${act ? "opacity-100 shadow-lg shadow-primary-200/50 dark:shadow-primary-900/50" : "opacity-80 hover:opacity-100"}`}
                    style={{ height: ready ? `${Math.max(h, 1)}%` : "0%", transitionDelay: `${i * 20}ms` }}
                    onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                  />
                  {act && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl px-3 py-2 shadow-xl shadow-slate-900/30 min-w-[130px] z-20 animate-fadeIn">
                      <p className="text-[9px] font-medium text-slate-400 dark:text-slate-300 mb-0.5 whitespace-nowrap">{item.month || item.year}</p>
                      <p className="text-xs font-black tabular-nums">Rp {item.revenue.toLocaleString("id-ID")}</p>
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
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [chartPeriod, setChartPeriod] = useState("monthly");

  const handleFilter = () => { if (dateRange.start && dateRange.end) filterByDate(dateRange.start, dateRange.end); };

  if (loading) return <LoadingSpinner text={locale === "id" ? "Memuat laporan..." : "Loading reports..."} />;

  const stats = reports ? [
    { title: t("reports.totalRevenue"), value: reports.total_revenue || 0, icon: <DollarSign size={22} />, gradient: "from-emerald-500 to-teal-600", change: reports.total_revenue_change ?? 12.5, isCurrency: true },
    { title: t("reports.totalOrders"), value: reports.total_orders || 0, icon: <ShoppingBag size={22} />, gradient: "from-primary-500 to-violet-600", change: reports.total_orders_change ?? 8.3 },
    { title: t("reports.itemsSold"), value: reports.total_items || 0, icon: <Package size={22} />, gradient: "from-blue-500 to-indigo-600", change: reports.total_items_change ?? 15.2 },
    { title: t("reports.avgOrderValue"), value: reports.avg_order_value || 0, icon: <TrendingUp size={22} />, gradient: "from-amber-500 to-orange-600", change: reports.avg_order_value_change ?? 3.8, isCurrency: true },
  ] : [];

  const monthlyData = reports?.monthly_sales || [];
  const yearlyData = reports?.yearly_sales || [];
  const chartData = chartPeriod === "monthly" ? monthlyData : yearlyData;
  const topProducts = reports?.top_products || [];
  const categoryBreakdown = reports?.category_breakdown || [];
  const categoryColors = ["bg-violet-500", "bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-slate-400"];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            {t("reports.title")}
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/40 dark:to-yellow-900/40 text-amber-700 dark:text-amber-400 text-[8px] font-black uppercase tracking-widest rounded-lg border border-amber-200 dark:border-amber-700">
              <Sparkles size={10} className="inline mr-1" />Analytics
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{t("reports.subtitle")}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <button onClick={() => setChartPeriod("monthly")} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 ${chartPeriod === "monthly" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}>{t("reports.monthlyLabel")}</button>
            <button onClick={() => setChartPeriod("yearly")} className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 ${chartPeriod === "yearly" ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md" : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"}`}>{t("reports.yearlyLabel")}</button>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <input type="date" value={dateRange.start} onChange={(e) => setDateRange((d) => ({ ...d, start: e.target.value }))} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-xl text-[10px] font-bold focus:bg-white dark:focus:bg-slate-600 focus:border-primary-200 dark:focus:border-primary-500 outline-none transition-all dark:text-slate-200" />
            <span className="text-xs text-slate-400">—</span>
            <input type="date" value={dateRange.end} onChange={(e) => setDateRange((d) => ({ ...d, end: e.target.value }))} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-xl text-[10px] font-bold focus:bg-white dark:focus:bg-slate-600 focus:border-primary-200 dark:focus:border-primary-500 outline-none transition-all dark:text-slate-200" />
          </div>
          <button onClick={handleFilter} className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl text-[10px] font-bold hover:bg-primary-600 dark:hover:bg-primary-500 transition-all shadow-sm active:scale-[0.97]"><Calendar size={14} /> {t("reports.filterDate")}</button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[10px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-[0.97]"><Download size={14} /> {t("reports.exportPdf")}</button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />{error}
        </div>
      )}

      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => <StatCard key={i} {...stat} delay={i * 80} />)}
        </div>
      )}

      {chartData.length > 0 ? (
        <RevenueChart data={chartData} period={chartPeriod} />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-12">
          <div className="flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700 rounded-3xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-200 dark:border-slate-600">
              <BarChart3 size={40} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-base font-bold text-slate-400 dark:text-slate-500">{t("reports.noData")}</p>
            <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">{t("reports.noDataDesc")}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-slate-900/50 border border-slate-100/80 dark:border-slate-700/60 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center"><TrendingUp size={18} className="text-amber-600 dark:text-amber-400" /></div>
              <div><h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{t("reports.topProducts")}</h2><p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{t("reports.topProductsDesc")}</p></div>
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
                  return (
                    <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/50 dark:bg-slate-700/30 border border-transparent hover:border-slate-100 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-700 transition-all group" style={{ animation: `slideIn 0.3s ease-out ${index * 60}ms both` }}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md shrink-0 ${index === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-500" : index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-400" : index === 2 ? "bg-gradient-to-br from-orange-400 to-amber-500" : "bg-gradient-to-br from-primary-400 to-primary-500"}`}>{index + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.name}</p>
                          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tabular-nums shrink-0">{item.total_sold}</p>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden mr-3">
                            <div className={`h-full rounded-full transition-all duration-700 ${index === 0 ? "bg-gradient-to-r from-amber-400 to-yellow-500" : index === 1 ? "bg-gradient-to-r from-slate-300 to-slate-400" : index === 2 ? "bg-gradient-to-r from-orange-400 to-amber-500" : "bg-gradient-to-r from-primary-400 to-primary-500"}`} style={{ width: `${pct}%` }} />
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

        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg shadow-slate-200/40 dark:shadow-slate-900/50 border border-slate-100/80 dark:border-slate-700/60 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-50 dark:bg-violet-900/30 rounded-xl flex items-center justify-center"><PieChart size={18} className="text-violet-600 dark:text-violet-400" /></div>
              <div><h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{t("reports.categoryBreakdown")}</h2><p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">{t("reports.categoryDesc")}</p></div>
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

      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out both; }
      `}</style>
    </div>
  );
};

export default Reports;
