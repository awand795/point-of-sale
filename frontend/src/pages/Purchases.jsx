import { useState } from 'react';
import { X, Eye, PackageCheck, Filter, Package } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePurchases } from '../hooks/usePurchases';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const statusStyles = {
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    received: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    cancelled: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
};

const Purchases = () => {
    const { t } = useLanguage();
    const { purchases, loading, error, receivePurchase, filterByStatus, pagination, goToPage } = usePurchases();
    const { isDemo } = useAuth();
    const { showToast } = useToast();
    const [statusFilter, setStatusFilter] = useState('');
    const [showDetail, setShowDetail] = useState(null);

    const handleReceive = async (id) => {
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm('Receive this purchase order? This will update stock.')) {
            const result = await receivePurchase(id);
            if (result.status !== 'success') alert('Failed to receive purchase');
        }
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        filterByStatus(value || undefined);
    };

    if (loading) return (
        <div className="space-y-6">
            <PageHeader title={t('sidebar.purchases')} subtitle="Manage purchase orders and stock receiving" />
            <LoadingSpinner text="Memuat pembelian..." />
        </div>
    );

    return (
        <div className="space-y-6">
            <PageHeader title={t('sidebar.purchases')} subtitle="Manage purchase orders and stock receiving" />

            {/* Filter bar */}
            <div className="flex items-center gap-4 bg-surface dark:bg-surface-raised p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-2"><Filter size={14} className="text-slate-400" /><span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</span></div>
                <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-lg text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-primary-200 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 outline-none appearance-none cursor-pointer">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {error && <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400">{error}</div>}

            <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Invoice</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Supplier</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                        {purchases.length === 0 ? (<tr><td colSpan="5" className="px-4 py-12 text-center"><Package size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" /><p className="text-sm text-slate-400 dark:text-slate-500">No purchase orders found</p></td></tr>) : purchases.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-4 py-3"><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{p.invoice_number}</p><p className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(p.created_at).toLocaleDateString('id-ID')}</p></td>
                                <td className="px-4 py-3"><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{p.supplier?.name || 'Walk-in'}</p></td>
                                <td className="px-4 py-3 text-right"><p className="text-sm font-bold text-slate-800 dark:text-slate-200">Rp {Number(p.total).toLocaleString('id-ID')}</p></td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md border ${statusStyles[p.status] || 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500'}`}>{p.status}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => setShowDetail(p)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"><Eye size={14} /></button>
                                        {p.status === 'pending' && (
                                            <button onClick={() => handleReceive(p.id)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all" title="Receive Stock"><PackageCheck size={14} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex justify-center gap-1">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-all ${
                                pagination.current_page === page
                                    ? 'bg-primary-500 text-white'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <div><h2 className="text-lg font-semibold text-slate-800 dark:text-white">Purchase Detail</h2><p className="text-xs text-slate-400 dark:text-slate-500">{showDetail.invoice_number}</p></div>
                            <button onClick={() => setShowDetail(null)} className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500">Supplier</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{showDetail.supplier?.name || '-'}</p></div>
                                <div><p className="text-xs font-medium text-slate-400 dark:text-slate-500">Status</p><span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-md border mt-1 ${statusStyles[showDetail.status] || ''}`}>{showDetail.status}</span></div>
                            </div>
                            {showDetail.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 dark:border-white/[0.04] last:border-0">
                                    <div><p className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.product?.name || 'Unknown'}</p><p className="text-xs text-slate-400 dark:text-slate-500">Rp {Number(item.purchase_price).toLocaleString('id-ID')} × {item.quantity}</p></div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.08] space-y-1">
                                <div className="flex justify-between text-xs"><span className="text-slate-400 dark:text-slate-500">Subtotal</span><span className="font-semibold text-slate-800 dark:text-slate-200">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span></div>
                                {Number(showDetail.discount) > 0 && <div className="flex justify-between text-xs"><span className="text-red-400">Discount</span><span className="font-semibold text-red-500">-Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span></div>}
                                {Number(showDetail.tax) > 0 && <div className="flex justify-between text-xs"><span className="text-slate-400 dark:text-slate-500">Tax</span><span className="font-semibold text-slate-800 dark:text-slate-200">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span></div>}
                                <div className="flex justify-between text-sm pt-2 border-t border-slate-100 dark:border-white/[0.08]"><span className="font-bold text-slate-800 dark:text-white">Total</span><span className="font-bold text-primary-600 dark:text-primary-400">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span></div>
                            </div>
                            <button onClick={() => setShowDetail(null)} className="w-full py-3 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Purchases;
