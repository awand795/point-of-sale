import { useState } from 'react';
import { Eye, X, Search, Receipt, Calendar, Filter } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';

const statusStyles = {
    completed: 'bg-emerald-50 text-emerald-700',
    paid: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    cancelled: 'bg-red-50 text-red-700',
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
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Transactions</h1>
                <p className="text-sm text-slate-500">View and manage all transactions</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <form onSubmit={handleDateFilter} className="flex">
                    <div className="relative">
                        <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                    </div>
                    <button type="submit" className="ml-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition">
                        <Search size={18} />
                    </button>
                </form>

                <div className="relative">
                    <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                    >
                        <option value="">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">{error}</div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/50">
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Cashier</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Payment</th>
                            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-5 py-12 text-center">
                                    <Receipt size={32} className="mx-auto text-slate-300 mb-2" />
                                    <p className="text-sm text-slate-400">No transactions found</p>
                                </td>
                            </tr>
                        ) : (
                            transactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-slate-50/50 transition">
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-medium text-slate-800">{trx.invoice_number}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm text-slate-500">
                                            {new Date(trx.created_at).toLocaleDateString('id-ID', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm text-slate-500">{trx.user?.name || '-'}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Rp {Number(trx.total).toLocaleString('id-ID')}
                                        </p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm text-slate-500 capitalize">{trx.payment_method || '-'}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                                            statusStyles[trx.status] || 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <button
                                            onClick={() => setShowDetail(trx)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        {trx.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(trx.id)}
                                                className="ml-1 px-2 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {pagination.last_page > 1 && (
                <div className="flex justify-center gap-1.5">
                    {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                                pagination.current_page === page
                                    ? 'bg-primary-600 text-white shadow-sm'
                                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Transaction Detail</h2>
                                <p className="text-sm text-slate-500">{showDetail.invoice_number}</p>
                            </div>
                            <button onClick={() => setShowDetail(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-2.5 mb-5">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Date</span>
                                <span className="text-slate-700">{new Date(showDetail.created_at).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Cashier</span>
                                <span className="text-slate-700">{showDetail.user?.name || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Payment Method</span>
                                <span className="text-slate-700 capitalize">{showDetail.payment_method || '-'}</span>
                            </div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-slate-400">Status</span>
                                <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${
                                    statusStyles[showDetail.status] || 'bg-slate-100 text-slate-700'
                                }`}>
                                    {showDetail.status}
                                </span>
                            </div>
                            {showDetail.notes && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Notes</span>
                                    <span className="text-slate-700">{showDetail.notes}</span>
                                </div>
                            )}
                        </div>

                        {showDetail.items && showDetail.items.length > 0 && (
                            <div className="border-t border-slate-100 pt-4 mb-4">
                                <h3 className="text-sm font-semibold text-slate-700 mb-3">Items</h3>
                                <div className="bg-slate-50 rounded-xl overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-slate-200/60">
                                                <th className="text-left py-2.5 px-3 text-xs font-semibold text-slate-500">Product</th>
                                                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500">Qty</th>
                                                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500">Price</th>
                                                <th className="text-right py-2.5 px-3 text-xs font-semibold text-slate-500">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {showDetail.items.map((item, idx) => (
                                                <tr key={idx} className="border-b border-slate-200/40 last:border-0">
                                                    <td className="py-2 px-3 text-slate-700">{item.product?.name || '-'}</td>
                                                    <td className="text-right py-2 px-3 text-slate-500">{item.quantity}</td>
                                                    <td className="text-right py-2 px-3 text-slate-500">Rp {Number(item.selling_price).toLocaleString('id-ID')}</td>
                                                    <td className="text-right py-2 px-3 font-medium text-slate-700">Rp {Number(item.subtotal).toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-slate-100 pt-3 space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-slate-700">Rp {Number(showDetail.subtotal).toLocaleString('id-ID')}</span>
                            </div>
                            {Number(showDetail.discount) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Discount</span>
                                    <span className="text-red-500">- Rp {Number(showDetail.discount).toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            {Number(showDetail.tax) > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Tax</span>
                                    <span className="text-slate-700">Rp {Number(showDetail.tax).toLocaleString('id-ID')}</span>
                                </div>
                            )}
                            <div className="flex justify-between font-bold text-base pt-1">
                                <span className="text-slate-800">Total</span>
                                <span className="text-primary-600">Rp {Number(showDetail.total).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Paid</span>
                                <span className="text-slate-700">Rp {Number(showDetail.paid_amount).toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Change</span>
                                <span className="text-emerald-600 font-medium">Rp {(Number(showDetail.paid_amount) - Number(showDetail.total)).toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <div className="flex justify-end mt-5">
                            <button
                                onClick={() => setShowDetail(null)}
                                className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Transactions;
