import { useState } from 'react';
import { Plus, Search, X, Eye, PackageCheck, Filter, Truck, Package } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { usePurchases } from '../hooks/usePurchases';
import EmptyState, { LoadingSpinner } from "../components/shared/EmptyState";

const statusStyles = {
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    received: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
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

    if (loading) return <LoadingSpinner text="Memuat pembelian..." />;

    return (
        <div className="space-y-5">
            <div><h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('sidebar.purchases')}</h1><p className="text-sm text-slate-500 font-medium">Manage purchase orders and stock receiving</p></div>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2"><Filter size={14} className="text-slate-400" /><span className="text-xs font-semibold text-slate-400 uppercase">Status</span></div>
                <select value={statusFilter} onChange={(e) => handleStatusFilter(e.target.value)} className="pl-3 pr-8 py-2 bg-slate-50 border border-transparent rounded-lg text-sm font-medium focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 outline-none appearance-none cursor-pointer">
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="received">Received</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <table className="min-w-full">
                    <thead><tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Supplier</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr></thead>
                    <tbody className="divide-y divide-slate-100">
                        {purchases.length === 0 ? (<tr><td colSpan="5" className="px-5 py-12 text-center"><Package size={32} className="mx-auto text-slate-300 mb-2" /><p className="text-sm text-slate-400">No purchase orders found</p></td></tr>) : purchases.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50/50 transition">
                                <td className="px-5 py-3.5"><p className="text-sm font-semibold text-slate-800">{p.invoice_number}</p><p className="text-[10px] text-slate-400">{new Date(p.created_at).toLocaleDateString('id-ID')}</p></td>
                                <td className="px-5 py-3.5"><p className="text-sm font-medium text-slate-700">{p.supplier?.name || 'Walk-in'}</p></td>
                                <td className="px-5 py-3.5 text-right"><p className="text-sm font-bold text-slate-800">Rp {Number(p.total).toLocaleString('id-ID')}</p></td>
                                <td className="px-5 py-3.5"><span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${statusStyles[p.status] || 'bg-slate-50 text-slate-400'}`}>{p.status}</span></td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                        <button onClick={() => setShowDetail(p)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"><Eye size={16} /></button>
                                        {p.status === 'pending' && (
                                            <button onClick={() => handleReceive(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition" title="Receive Stock"><PackageCheck size={16} /></button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination.last_page > 1 && (<div className="flex justify-center gap-1.5">{Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => goToPage(page)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${pagination.current_page === page ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{page}</button>))}</div>)}

            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <div><h2 className="text-lg font-bold text-slate-800">Purchase Detail</h2><p className="text-xs text-slate-400">{showDetail.invoice_number}</p></div>
                            <button onClick={() => setShowDetail(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"><X size={18} /></button>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-xs font-medium text-slate-400">Supplier</p><p className="text-sm font-semibold text-slate-800">{showDetail.supplier?.name || '-'}</p></div>
                                <div><p className="text-xs font-medium text-slate-400">Status</p><span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border mt-1 ${statusStyles[showDetail.status] || ''}`}>{showDetail.status}</span></div>
                            </div>
                            {showDetail.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                    <div><p className="text-sm font-medium text-slate-700">{item.product?.name || 'Unknown'}</p><p className="text-xs text-slate-400">Rp {Number(item.purchase_price).toLocaleString('id-ID')} × {item.quantity}</p></div>
                                    <p className="text-sm font-semibold text-slate-800">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                </div>
                            ))}
                            <div className="pt-3 border-t border-slate-100 space-y-1">
                                <div className="flex justify-between text-xs"><span className="text-slate-400">Subtotal</span><span className="font-semibold">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span></div>
                                {Number(showDetail.discount) > 0 && <div className="flex justify-between text-xs"><span className="text-red-400">Discount</span><span className="font-semibold text-red-500">-Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span></div>}
                                {Number(showDetail.tax) > 0 && <div className="flex justify-between text-xs"><span className="text-slate-400">Tax</span><span className="font-semibold">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span></div>}
                                <div className="flex justify-between text-sm pt-2 border-t border-slate-100"><span className="font-bold text-slate-800">Total</span><span className="font-bold text-primary-600">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span></div>
                            </div>
                            <button onClick={() => setShowDetail(null)} className="w-full py-3 text-sm font-medium text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Purchases;
