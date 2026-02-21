import { useEffect, useState } from "react";
import {
    DollarSign,
    ShoppingBag,
    Package,
    AlertTriangle,
    TrendingUp,
    ArrowUpRight
} from "lucide-react";
import { transactionApi } from "../api/transactions";

const StatCard = ({ title, value, icon, color, bgColor }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 hover:shadow-md transition">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm text-slate-500 mb-1">{title}</p>
                <p className="text-2xl font-bold text-slate-800">{value}</p>
            </div>
            <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
                <span className={color}>{icon}</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {
        transactionApi.getDashboard().then(res => {
            setDashboard(res.data.data);
        }).catch(() => {});
    }, []);

    if (!dashboard) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    const stats = [
        {
            title: "Today's Sales",
            value: `Rp ${Number(dashboard.stats.today_sales).toLocaleString('id-ID')}`,
            icon: <DollarSign size={22} />,
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            title: "Transactions",
            value: dashboard.stats.today_transactions,
            icon: <ShoppingBag size={22} />,
            color: "text-primary-600",
            bgColor: "bg-primary-50"
        },
        {
            title: "Items Sold",
            value: dashboard.stats.today_items_sold,
            icon: <Package size={22} />,
            color: "text-violet-600",
            bgColor: "bg-violet-50"
        },
        {
            title: "Low Stock",
            value: dashboard.stats.low_stock_products,
            icon: <AlertTriangle size={22} />,
            color: "text-red-600",
            bgColor: "bg-red-50"
        },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500">Overview of today's business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-800">Recent Transactions</h2>
                        <TrendingUp size={16} className="text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        {dashboard.recent_transactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{tx.invoice_number}</p>
                                    <p className="text-xs text-slate-400">{new Date(tx.created_at).toLocaleString('id-ID')}</p>
                                </div>
                                <p className="text-sm font-semibold text-slate-800 mx-3">
                                    Rp {Number(tx.total).toLocaleString('id-ID')}
                                </p>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    tx.status === 'paid'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {tx.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-slate-800">Top Selling Products</h2>
                        <ArrowUpRight size={16} className="text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        {(dashboard.top_products || []).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-lg flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-700">{item.product?.name}</p>
                                    <p className="text-xs text-slate-400">{item.total_sold} sold</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
