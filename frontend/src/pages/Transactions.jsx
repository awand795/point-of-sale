import { useState } from 'react';
import { Eye, X, Search, Receipt, Calendar, Filter, Download, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';

const statusStyles = {
    completed: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    paid: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    cancelled: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
};

const Transactions = () => {
    const { t } = useLanguage();
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
    const { isDemo } = useAuth();
    const { showToast } = useToast();

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
        if (isDemo) {
            showToast('warning');
            return;
        }
        if (window.confirm(t('transactions.deleteConfirm'))) {
            const result = await cancelTransaction(id);
            if (!result.success) {
                alert(result.error || 'Failed to cancel transaction');
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-100 dark:border-primary-900/30 border-t-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t('transactions.title')}</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{t('transactions.subtitle')}</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
                    <Download size={16} />
                    {t('transactions.exportReports')}
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                        <Filter size={14} />
                    </div>                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('transactions.filters')}</span>
                </div>
                
                <form onSubmit={handleDateFilter} className="flex items-center gap-2">
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-primary-200 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 transition-all outline-none"
                        />
                    </div>
                    <button type="submit" className="p-2 bg-slate-900 dark:bg-primary-600 text-white rounded-xl hover:bg-primary-600 transition-all shadow-lg shadow-slate-100 dark:shadow-none">
                        <Search size={16} />
                    </button>
                </form>

                <div className="h-6 w-px bg-slate-100 dark:bg-slate-700"></div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-700 border border-transparent rounded-2xl text-xs font-bold text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-700 focus:border-primary-200 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/20 transition-all outline-none appearance-none cursor-pointer"
                    >
                        <option value="">{t('transactions.allStatus')}</option>
                        <option value="completed">{t('transactions.completed')}</option>
                        <option value="pending">{t('transactions.pending')}</option>
                        <option value="cancelled">{t('transactions.cancelled')}</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Filter size={12} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <X size={16} />
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/50">
                                <th className="px-8 py-5">{t('transactions.invoice')}</th>
                                <th className="px-8 py-5">{t('transactions.dateTime')}</th>
                                <th className="px-8 py-5">{t('transactions.cashier')}</th>
                                <th className="px-8 py-5 text-right">{t('transactions.amount')}</th>
                                <th className="px-8 py-5">{t('transactions.method')}</th>
                                <th className="px-8 py-5 text-center">{t('transactions.status')}</th>
                                <th className="px-8 py-5 text-right">{t('transactions.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/30">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-8 py-20 text-center">
                                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Receipt size={32} className="text-slate-200 dark:text-slate-600" />
                                        </div>
                                        <p className="text-lg font-bold text-slate-400 dark:text-slate-500">{t('transactions.noRecords')}</p>
                                        <p className="text-sm text-slate-300 dark:text-slate-600 mt-1">{t('transactions.noRecordsDesc')}</p>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{trx.invoice_number}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                                {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                                                {new Date(trx.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-black text-slate-400 dark:text-slate-500 capitalize">
                                                    {trx.user?.name?.charAt(0) || '-'}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{trx.user?.name || 'Walk-in'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <p className="text-sm font-black text-slate-900 dark:text-white">
                                                Rp {Number(trx.total).toLocaleString('id-ID')}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{trx.payment_method || '-'}</span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                statusStyles[trx.status] || 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700'
                                            }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setShowDetail(trx)}
                                                    className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
                                                    title={t('transactions.viewDetails')}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {trx.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(trx.id)}
                                                        className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                                        title={t('transactions.cancelOrder')}
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
                                    ? 'bg-slate-900 dark:bg-primary-600 text-white shadow-xl shadow-slate-200 dark:shadow-none translate-y-[-2px]'
                                    : 'bg-white dark:bg-slate-700 border border-slate-100 dark:border-slate-600 text-slate-400 dark:text-slate-300 hover:border-primary-200 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="px-10 py-8 bg-slate-900 dark:bg-primary-800 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{t('transactions.receipt')}</h2>
                                <p className="text-xs text-slate-400 dark:text-slate-300 font-bold uppercase tracking-[0.2em] mt-1">{showDetail.invoice_number}</p>
                            </div>
                            <button 
                                onClick={() => setShowDetail(null)} 
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-2xl text-white/60 hover:text-white transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-10 dark:text-white">
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('transactions.transactionDate')}</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{new Date(showDetail.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('transactions.cashierTerminal')}</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{showDetail.user?.name || 'Walk-in'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('transactions.paymentInfo')}</p>
                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 capitalize">{showDetail.payment_method || '-'} Card/Cash</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('transactions.orderStatus')}</p>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-1 border ${
                                            statusStyles[showDetail.status] || 'bg-slate-50 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-700'
                                        }`}>
                                            {showDetail.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {showDetail.items && showDetail.items.length > 0 && (
                                <div className="mb-10">
                                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">{t('transactions.lineItems')}</p>
                                    <div className="space-y-4">
                                        {showDetail.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center group">
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Rp {Number(item.selling_price).toLocaleString('id-ID')} × {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 pt-8 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-400 dark:text-slate-500">{t('transactions.subtotal')}</span>
                                    <span className="text-slate-700 dark:text-slate-300">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span>
                                </div>
                                {Number(showDetail.discount) > 0 && (
                                    <div className="flex justify-between text-xs font-bold text-red-500">
                                        <span>{t('transactions.totalDiscount')}</span>
                                        <span>- Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {Number(showDetail.tax) > 0 && (
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-400 dark:text-slate-500">{t('transactions.taxCharges')}</span>
                                        <span className="text-slate-700 dark:text-slate-300">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4">
                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{t('transactions.totalAmount')}</span>
                                    <span className="text-3xl font-black text-primary-600 dark:text-primary-400 tracking-tighter">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-3">
                                <button
                                    onClick={() => setShowDetail(null)}
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-all"
                                >
                                    {t('transactions.dismiss')}
                                </button>
                                <button
                                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-white bg-slate-900 dark:bg-primary-600 rounded-2xl hover:bg-primary-600 shadow-xl shadow-slate-200 dark:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={14} />
                                    {t('transactions.downloadPDF')}
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
