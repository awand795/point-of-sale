import { useState, useRef } from 'react';
import { Eye, X, Search, Receipt, Calendar, Filter, Download, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { exportTableToPdf, exportReceiptPdf } from '../utils/exportPdf';
import PageHeader from '../components/shared/PageHeader';
import { LoadingSpinner } from '../components/shared/EmptyState';

const statusStyles = {
    completed: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    paid: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800',
    pending: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800',
    cancelled: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800',
};

const Transactions = () => {
    const { t, locale } = useLanguage();
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
    const [exporting, setExporting] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const receiptContentRef = useRef(null);

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

    const handleExportAll = () => {
        setExporting(true);
        try {
            if (transactions.length === 0) {
                showToast('info', locale === 'id' ? 'Tidak ada transaksi untuk diekspor' : 'No transactions to export');
                setExporting(false);
                return;
            }

            const fmtDate = (d) => new Date(d).toLocaleDateString('id-ID', {
                day: '2-digit', month: 'short', year: 'numeric',
            });
            const fmtTime = (d) => new Date(d).toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit',
            });
            const fmtCurrency = (v) => `Rp ${Number(v).toLocaleString('id-ID')}`;

            const rows = transactions.map(t => ({
                invoice_number: t.invoice_number,
                date: `${fmtDate(t.created_at)} ${fmtTime(t.created_at)}`,
                cashier: t.user?.name || 'Walk-in',
                total_fmt: fmtCurrency(t.total),
                payment_method: t.payment_method || '-',
                status: t.status,
            }));

            exportTableToPdf(rows, {
                filename: `BikinPOS_Transactions_${new Date().toISOString().split('T')[0]}.pdf`,
                title: t('transactions.title'),
                subtitle: t('transactions.subtitle'),
                landscape: true,
                columns: [
                    { header: locale === 'id' ? 'Invoice' : 'Invoice', dataKey: 'invoice_number' },
                    { header: locale === 'id' ? 'Tanggal' : 'Date', dataKey: 'date' },
                    { header: locale === 'id' ? 'Kasir' : 'Cashier', dataKey: 'cashier' },
                    { header: locale === 'id' ? 'Total' : 'Amount', dataKey: 'total_fmt' },
                    { header: locale === 'id' ? 'Metode' : 'Method', dataKey: 'payment_method' },
                    { header: locale === 'id' ? 'Status' : 'Status', dataKey: 'status' },
                ],
            });
            showToast('success', locale === 'id' ? 'PDF berhasil diunduh' : 'PDF downloaded successfully');
        } catch (e) {
            console.error('Export failed:', e);
            showToast('error', locale === 'id' ? 'Gagal mengunduh PDF' : 'Failed to download PDF');
        }
        setExporting(false);
    };

    const handleDownloadReceipt = async () => {
        setDownloading(true);
        try {
            await exportReceiptPdf(receiptContentRef.current, {
                filename: `${showDetail?.invoice_number || 'receipt'}.pdf`,
            });
        } catch {}
        setDownloading(false);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <PageHeader title={t('transactions.title')} subtitle={t('transactions.subtitle')} />
                <LoadingSpinner text={locale === 'id' ? 'Memuat transaksi...' : 'Loading transactions...'} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={t('transactions.title')}
                subtitle={t('transactions.subtitle')}
                action={true}
                actionLabel={exporting ? (locale === 'id' ? 'Mengekspor...' : 'Exporting...') : t('transactions.exportReports')}
                actionIcon={Download}
                onAction={handleExportAll}
            />

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-surface dark:bg-surface-raised p-4 rounded-xl border border-slate-200/60 dark:border-white/[0.06]">
                <div className="flex items-center gap-2 px-1">
                    <Filter size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{t('transactions.filters')}</span>
                </div>
                
                <form onSubmit={handleDateFilter} className="flex items-center gap-2">
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors"
                        />
                    </div>
                    <button type="submit" className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-all shadow-sm">
                        <Search size={16} />
                    </button>
                </form>

                <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08]"></div>

                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="pl-3 pr-8 py-2 bg-slate-50 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.12] rounded-lg text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary-500 dark:focus:border-primary-400 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="">{t('transactions.allStatus')}</option>
                        <option value="completed">{t('transactions.completed')}</option>
                        <option value="pending">{t('transactions.pending')}</option>
                        <option value="cancelled">{t('transactions.cancelled')}</option>
                    </select>
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Filter size={12} />
                    </div>
                </div>
            </div>

            {error && (
                <div className="px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                    <X size={14} />
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-surface dark:bg-surface-raised rounded-xl border border-slate-200/60 dark:border-white/[0.06] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-white/[0.06]">
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t('transactions.invoice')}</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t('transactions.dateTime')}</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t('transactions.cashier')}</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 text-right">{t('transactions.amount')}</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400">{t('transactions.method')}</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 text-center">{t('transactions.status')}</th>
                                <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 text-right">{t('transactions.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-white/[0.04]">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center">
                                        <div className="w-12 h-12 bg-slate-50 dark:bg-white/[0.04] rounded-xl flex items-center justify-center mx-auto mb-3 border border-slate-100 dark:border-white/[0.06]">
                                            <Receipt size={24} className="text-slate-300 dark:text-slate-600" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{t('transactions.noRecords')}</p>
                                        <p className="text-xs text-slate-300 dark:text-slate-600 mt-1">{t('transactions.noRecordsDesc')}</p>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((trx) => (
                                    <tr key={trx.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-4 py-3">
                                            <span className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{trx.invoice_number}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-md bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-[10px] font-medium text-slate-400 dark:text-slate-500 capitalize">
                                                    {trx.user?.name?.charAt(0) || '-'}
                                                </div>
                                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{trx.user?.name || 'Walk-in'}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                                                Rp {Number(trx.total).toLocaleString('id-ID')}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">{trx.payment_method || '-'}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-medium border ${
                                                statusStyles[trx.status] || 'bg-slate-50 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-100 dark:border-white/[0.08]'
                                            }`}>
                                                {trx.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => setShowDetail(trx)}
                                                    className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all"
                                                    title={t('transactions.viewDetails')}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                {trx.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(trx.id)}
                                                        className="p-1.5 rounded-md text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                                        title={t('transactions.cancelOrder')}
                                                    >
                                                        <X size={16} />
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

            {/* Pagination */}
            {pagination?.last_page > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        {locale === 'id' ? 'Menampilkan' : 'Showing'} {((pagination.current_page - 1) * pagination.per_page) + 1}–{Math.min(pagination.current_page * pagination.per_page, pagination.total)} {locale === 'id' ? 'dari' : 'of'} {pagination.total}
                    </p>
                    <div className="flex items-center gap-1">
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
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-fadeInModal">
                        <div className="px-6 py-5 bg-slate-900 text-white flex justify-between items-start">
                            <div>
                                <h2 className="text-lg font-semibold">{t('transactions.receipt')}</h2>
                                <p className="text-xs text-slate-400 font-medium mt-0.5">{showDetail.invoice_number}</p>
                            </div>
                            <button 
                                onClick={() => setShowDetail(null)} 
                                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="p-6 dark:text-white" ref={receiptContentRef}>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('transactions.transactionDate')}</p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{new Date(showDetail.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('transactions.cashierTerminal')}</p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1">{showDetail.user?.name || 'Walk-in'}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('transactions.paymentInfo')}</p>
                                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 capitalize">{showDetail.payment_method || '-'} Card/Cash</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('transactions.orderStatus')}</p>
                                        <span className={`inline-flex px-2.5 py-0.5 rounded-md text-[10px] font-medium mt-1 border ${
                                            statusStyles[showDetail.status] || 'bg-slate-50 dark:bg-white/[0.04] text-slate-400 dark:text-slate-500 border-slate-100 dark:border-white/[0.08]'
                                        }`}>
                                            {showDetail.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {showDetail.items && showDetail.items.length > 0 && (
                                <div className="mb-6">
                                    <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mb-3">{t('transactions.lineItems')}</p>
                                    <div className="space-y-3">
                                        {showDetail.items.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center group">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{item.product?.name || 'Unknown Product'}</p>
                                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Rp {Number(item.selling_price).toLocaleString('id-ID')} × {item.quantity}</p>
                                                </div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white tabular-nums">Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-slate-400 dark:text-slate-500">{t('transactions.subtotal')}</span>
                                    <span className="text-slate-700 dark:text-slate-300 tabular-nums">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span>
                                </div>
                                {Number(showDetail.discount) > 0 && (
                                    <div className="flex justify-between text-xs font-medium text-red-500">
                                        <span>{t('transactions.totalDiscount')}</span>
                                        <span>- Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {Number(showDetail.tax) > 0 && (
                                    <div className="flex justify-between text-xs font-medium">
                                        <span className="text-slate-400 dark:text-slate-500">{t('transactions.taxCharges')}</span>
                                        <span className="text-slate-700 dark:text-slate-300 tabular-nums">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{t('transactions.totalAmount')}</span>
                                    <span className="text-2xl font-semibold text-primary-600 dark:text-primary-400 tabular-nums">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setShowDetail(null)}
                                    className="flex-1 py-3 text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/[0.06] rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.1] transition-all"
                                >
                                    {t('transactions.dismiss')}
                                </button>
                                <button
                                    onClick={handleDownloadReceipt}
                                    disabled={downloading}
                                    className="flex-1 py-3 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                >
                                    {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                    {downloading ? (locale === 'id' ? 'Mengunduh...' : 'Downloading...') : t('transactions.downloadPDF')}
                                </button>
                            </div>
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

export default Transactions;
