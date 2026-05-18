import { useState } from 'react';
import { Eye, X, Search, Receipt, Calendar, Filter, Download, ArrowUpRight } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';

const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    pending: 'bg-amber-50 text-amber-600 border-amber-100',
    cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const Transactions = () => {
    const {
        transactions,
        loading,
        error,
        pagination,
        goToPage,
        filterByDate,
        filterByStatus,
        cancelTransaction,
    } = useTransactions();

    const [dateFilter, setDateFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showDetail, setShowDetail] = useState(null);

    const handleDateFilter = (e) => {
        e.preventDefault();
        filterByDate(dateFilter || undefined);
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);
        filterByStatus(value || undefined);
    };

    const handleCancel = async (id) => {
        if (window.confirm('Are you sure you want to cancel this transaction?')) {
            const result = await cancelTransaction(id);
            if (!result.success) {
                alert(result.error || 'Failed to cancel transaction');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 border-t-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales History</h1>
                    <p className="text-sm text-slate-500 font-medium">Tracking and managing your retail flow</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                    <Download size={16} />
                    Export Reports
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Filter size={14} />
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filters</span>
                </div>
                
                <form onSubmit={handleDateFilter} className="flex items-center gap-2">
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none"
                        />
                    </div>
                    <button type="submit" className="p-2 bg-slate-900 text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-slate-100">
                        <Search size={16} />
                    </button>
                </form>

                <div className="h-6 w-px bg-slate-100"></div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-slate-50 border border-transparent rounded-2xl text-xs font-bold focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-50 transition-all outline-none appearance-none cursor-pointer"
                    >
                        <option value="">Status: All Records</option>
                        <option value="completed">Status: Completed</option>
                        <option value="pending">Status: Pending</option>
                        <option value="cancelled">Status: Cancelled</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Filter size={12} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <X size={16} />
                    {error}
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50">
                                <th className="px-8 py-5">Invoice</th>
                                <th className="px-8 py-5">Date & Time</th>
                                <th className="px-8 py-5">Cashier</th>
                                <th className="px-8 py-5 text-right">Amount</th>
                                <th className="px-8 py-5">Method</th>
                                <th className="px-8 py-5 text-center">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Receipt size={32} className="text-slate-200" />
                                        </div>
                                        <p className="text-lg font-bold text-slate-400">No records found</p>
                                        <p className="text-sm text-slate-300 mt-1">Try clearing filters to see more results</p>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-slate-900 group-hover:text-primary-600 transition-colors">{trx.invoice_number}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-slate-700">
                                                {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                                {new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 capitalize">
                                                    {trx.user?.name?.charAt(0) || '-'}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-600">{trx.user?.name || 'Walk-in'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <p className="text-sm font-black text-slate-900">
                                                Rp {Number(trx.total).toLocaleString('id-ID')}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{trx.payment_method || '-'}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                statusStyles[trx.status] || 'bg-slate-50 text-slate-400 border-slate-100'
                                            }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setShowDetail(trx)}
                                                    className="p-2 rounded-xl text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {trx.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(trx.id)}
                                                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                                                        title="Cancel Order"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {pagination.last_page > 1 && (
                <div className="flex justify-center items-center gap-2 py-4">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`min-w-[40px] h-10 flex items-center justify-center rounded-2xl text-xs font-black transition-all ${
                                pagination.current_page === page
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-y-[-2px]'
                                    : 'bg-white border border-slate-100 text-slate-400 hover:border-primary-200 hover:text-primary-600'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-10 py-8 bg-slate-900 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">Receipt</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{showDetail.invoice_number}</p>
                            </div>
                            <button 
                                onClick={() => setShowDetail(null)} 
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-2xl text-white/60 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10">
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Date</p>
                                        <p className="text-sm font-bold text-slate-800 mt-1">{new Date(showDetail.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cashier Terminal</p>
                                        <p className="text-sm font-bold text-slate-800 mt-1">{showDetail.user?.name || 'Walk-in'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Info</p>
                                        <p className="text-sm font-bold text-slate-800 mt-1 capitalize">{showDetail.payment_method || '-'} Card/Cash</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Status</p>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 border ${
                                            statusStyles[showDetail.status] || 'bg-slate-50 text-slate-400 border-slate-100'
                                        }`}>
                                            {showDetail.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {showDetail.items && showDetail.items.length > 0 && (
                                <div className="mb-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Line Items</p>
                                    <div className="space-y-4">
                                        {showDetail.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center group">
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800 group-hover:text-primary-600 transition-colors">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-xs text-slate-400 font-medium">Rp {Number(item.selling_price).toLocaleString('id-ID')} × {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-black text-slate-900">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 pt-8 border-t border-slate-100">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span className="text-slate-700">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span>
                                </div>
                                {Number(showDetail.discount) > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-red-500">
                                        <span>Total Discount</span>
                                        <span>- Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {Number(showDetail.tax) > 0 && (
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400">Tax Charges</span>
                                        <span className="text-slate-700">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                                    <span className="text-3xl font-black text-primary-600 tracking-tighter">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-3">
                                <button
                                    onClick={() => setShowDetail(null)}
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-white bg-slate-900 rounded-2xl hover:bg-primary-600 shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={14} />
                                    Download PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
