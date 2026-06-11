import { useState } from 'react';
import { X, Eye, PackageCheck, Filter, Package } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePurchases } from '../hooks/usePurchases';
import PageHeader from "../components/shared/PageHeader";
import { LoadingSpinner } from "../components/shared/EmptyState";

const statusStyles = {
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    received: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    cancelled: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400',
};

const Purchases = () => {
    const { t, locale } = useLanguage();
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

            {/* Filter bar — inline clean */}
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-surface-raised border border-slate-200 dark:border-white/[0.10] rounded-xl">
                    <Filter size={14} className="text-slate-400" />
                    <span className="text-[13px] font-medium text-slate-500 dark:text-slate-400">Status</span>
                    <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="pl-1 pr-6 py-1 bg-transparent text-[14px] font-medium text-slate-900 dark:text-white outline-none appearance-none cursor-pointer">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="received">Received</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </div>
                    <p className="text-[14px] font-medium text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            <div className="bg-white dark:bg-surface-raised rounded-2xl border border-slate-200/70 dark:border-white/[0.06] overflow-hidden shadow-sm">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-white/[0.02]">
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Invoice</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Supplier</th>
                            <th className="px-5 py-3.5 text-right text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Total</th>
                            <th className="px-5 py-3.5 text-left text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Status</th>
                            <th className="px-5 py-3.5 text-right text-[12px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.06em]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/70 dark:divide-white/[0.04]">
                        {purchases.length === 0 ? (<tr><td colSpan="5" className="px-5 py-16 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
                                <Package size={28} className="text-slate-300 dark:text-slate-600" />
                            </div>
                            <p className="text-[15px] font-semibold text-slate-500 dark:text-slate-400">No purchase orders found</p>
                        </td></tr>) : purchases.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors group">
                                <td className="px-5 py-3.5">
                                    <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">{p.invoice_number}</p>
                                    <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">{new Date(p.created_at).toLocaleDateString('id-ID')}</p>
                                </td>
                                <td className="px-5 py-3.5"><p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{p.supplier?.name || 'Walk-in'}</p></td>
                                <td className="px-5 py-3.5 text-right"><p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 tabular-nums">Rp {Number(p.total).toLocaleString('id-ID')}</p></td>
                                <td className="px-5 py-3.5">
                                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-semibold ${statusStyles[p.status] || 'bg-slate-100 dark:bg-white/[0.06] text-slate-500 dark:text-slate-400'}`}>{p.status}</span>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
                                        <button onClick={() => setShowDetail(p)} className="p-2 rounded-lg text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all" title="Detail"><Eye size={15} /></button>
                                        {p.status === 'pending' && (
                                            <button onClick={() => handleReceive(p.id)} className="p-2 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-all" title="Receive Stock"><PackageCheck size={15} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination?.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-[13px] text-slate-400 dark:text-slate-500">
                        {locale === 'id' ? 'Menampilkan' : 'Showing'} {((pagination.current_page - 1) * pagination.per_page) + 1}–{Math.min(pagination.current_page * pagination.per_page, pagination.total)} {locale === 'id' ? 'dari' : 'of'} {pagination.total}
                    </p>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                            <button key={page} onClick={() => goToPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-[13px] font-medium transition-all ${pagination.current_page === page ? 'bg-primary-500 text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.06]'}`}>{page}</button>
                        ))}
                    </div>
                </div>
            )}

            {showDetail && (
                <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-surface-raised rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fadeInModal">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-white/[0.06]">
                            <div><h2 className="text-[17px] font-semibold tracking-tight text-slate-900 dark:text-white">Purchase Detail</h2><p className="text-[13px] text-slate-400 dark:text-slate-500 mt-0.5">{showDetail.invoice_number}</p></div>
                            <button onClick={() => setShowDetail(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"><X size={18} /></button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Supplier</p><p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{showDetail.supplier?.name || '-'}</p></div>
                                <div><p className="text-[12px] font-medium text-slate-400 dark:text-slate-500">Status</p><span className={`inline-flex px-2.5 py-1 rounded-lg text-[12px] font-semibold mt-0.5 ${statusStyles[showDetail.status] || ''}`}>{showDetail.status}</span></div>
                            </div>
                            <div className="border-t border-slate-100 dark:border-white/[0.06] pt-4 space-y-3">
                                {showDetail.items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div><p className="text-[14px] font-medium text-slate-700 dark:text-slate-300">{item.product?.name || 'Unknown'}</p><p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5">Rp {Number(item.purchase_price).toLocaleString('id-ID')} × {item.quantity}</p></div>
                                        <p className="text-[14px] font-semibold text-slate-800 dark:text-slate-200 tabular-nums">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-1.5">
                                <div className="flex justify-between text-[13px]"><span className="text-slate-400 dark:text-slate-500">Subtotal</span><span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span></div>
                                {Number(showDetail.discount) > 0 && <div className="flex justify-between text-[13px]"><span className="text-red-400">Discount</span><span className="font-semibold text-red-500 tabular-nums">-Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span></div>}
                                {Number(showDetail.tax) > 0 && <div className="flex justify-between text-[13px]"><span className="text-slate-400 dark:text-slate-500">Tax</span><span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span></div>}
                                <div className="flex justify-between text-[15px] pt-3 border-t border-slate-100 dark:border-white/[0.06]"><span className="font-bold text-slate-900 dark:text-white">Total</span><span className="font-bold text-primary-600 dark:text-primary-400 tabular-nums">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span></div>
                            </div>
                            <button onClick={() => setShowDetail(null)} className="w-full py-2.5 text-[14px] font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/[0.06] rounded-xl hover:bg-slate-200 dark:hover:bg-white/[0.10] transition-all mt-2">Close</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes fadeInModal {
                    from { opacity: 0; transform: scale(0.97); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeInModal {
                    animation: fadeInModal 0.2s ease-out both;
                }
            `}</style>
        </div>
    );
};

export default Purchases;
