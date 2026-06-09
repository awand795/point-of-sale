import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, X, Check } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { transactionApi } from "../../api/transactions";

const Cart = ({ cart }) => {
    const { t } = useLanguage();
    const { items, updateQuantity, removeFromCart, subtotal, itemCount, calculateTotal, getCartItemsForApi, clearCart, isEmpty } = cart;

    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);
    const [note, setNote] = useState('');
    const [success, setSuccess] = useState(false);

    const total = calculateTotal(discount, tax);
    const change = paidAmount - total;

    const handleCheckout = async () => {
        if (isEmpty) return;
        if (paidAmount < total) return;
        setProcessing(true);
        try {
            await transactionApi.create({
                items: getCartItemsForApi(),
                discount,
                tax,
                paid_amount: paidAmount,
                payment_method: paymentMethod,
                notes: note
            });
            setSuccess(true);
            setTimeout(() => {
                clearCart();
                setPaidAmount(0);
                setDiscount(0);
                setTax(0);
                setNote('');
                setSuccess(false);
            }, 1500);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create transaction');
        }
        setProcessing(false);
    };

    const paymentMethods = [
        { value: 'cash', label: 'Cash', icon: <Banknote size={22} />, color: 'from-emerald-500 to-teal-600' },
        { value: 'debit', label: 'Debit', icon: <CreditCard size={22} />, color: 'from-blue-500 to-indigo-600' },
        { value: 'credit', label: 'Credit', icon: <CreditCard size={22} />, color: 'from-violet-500 to-purple-600' },
        { value: 'qris', label: 'QRIS', icon: <Smartphone size={22} />, color: 'from-orange-500 to-rose-600' },
    ];

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden relative">
            {/* Success overlay */}
            {success && (
                <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-md flex flex-col items-center justify-center animate-fadeIn">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-emerald-100">
                        <Check size={40} className="text-emerald-600" />
                    </div>
                    <p className="text-2xl font-black text-slate-900">Transaction Complete!</p>
                    <p className="text-sm text-slate-500 font-medium mt-2">Receipt is being printed...</p>
                </div>
            )}

            {/* Header */}
            <div className="shrink-0 px-6 py-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            <ShoppingCart size={20} className="text-primary-400" />
                            {t('pos.currentOrder')}
                        </h2>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-1">
                            {t('pos.customer')}: <span className="text-white">Walk-in</span>
                            {itemCount > 0 && <span className="ml-3 text-primary-400">{itemCount} items</span>}
                        </p>
                    </div>
                    {itemCount > 0 && (
                        <button onClick={clearCart}
                            className="p-2.5 bg-white/10 hover:bg-red-500/20 text-white/50 hover:text-red-400 rounded-xl transition-all active:scale-90">
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2 space-y-1">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-200">
                        <div className="w-28 h-28 bg-slate-50/50 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                            <ShoppingCart size={44} className="text-slate-200" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">{t('pos.cartEmpty')}</p>
                        <p className="text-xs text-slate-300 mt-1 text-center px-8">{t('pos.cartEmptyDesc')}</p>
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <div key={item.id}
                            className="group flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50/80 transition-all duration-200 animate-slideIn"
                            style={{ animationDelay: `${idx * 30}ms` }}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs uppercase shadow-sm">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    item.name.substring(0, 2)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                                    <button onClick={() => removeFromCart(item.id)}
                                        className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all shrink-0">
                                        <X size={14} />
                                    </button>
                                </div>
                                <p className="text-[11px] font-bold text-primary-600 mt-0.5">
                                    Rp {(item.price || 0).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition active:scale-90">
                                    <Minus size={12} />
                                </button>
                                <span className="w-5 text-center text-xs font-black text-slate-700 tabular-nums">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition active:scale-90">
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Checkout Footer */}
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 px-6 py-5 space-y-4">
                {/* Totals */}
                <div className="space-y-2.5">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-medium">{t('pos.subtotal')}</span>
                        <span className="font-bold text-slate-700 tabular-nums">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-wider">DISC</span>
                            <input type="number" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-full pl-14 pr-3 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-400 transition-all bg-white" />
                        </div>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-wider">TAX</span>
                            <input type="number" value={tax || ''} onChange={(e) => setTax(Number(e.target.value))}
                                className="w-full pl-12 pr-3 py-2.5 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 focus:border-primary-400 transition-all bg-white" />
                        </div>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-sm font-bold text-slate-800">{t('pos.totalPayable')}</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight tabular-nums">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                {/* Payment Method */}
                <div className="space-y-2.5">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('pos.paymentMethod')}</p>
                    <div className="grid grid-cols-4 gap-2">
                        {paymentMethods.map((method) => (
                            <button key={method.value}
                                onClick={() => setPaymentMethod(method.value)}
                                className={`relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border-2 transition-all duration-200 active:scale-95 ${
                                    paymentMethod === method.value
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                                }`}
                            >
                                {method.icon}
                                <span className="text-[8px] font-bold uppercase tracking-tight">{method.label}</span>
                                {paymentMethod === method.value && (
                                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Check size={10} className="text-white" />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Received & Change */}
                <div className="space-y-2.5">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('pos.received')}</span>
                        <input type="number" value={paidAmount || ''} onChange={(e) => setPaidAmount(Number(e.target.value))}
                            className="w-full pl-24 pr-4 py-3.5 text-lg font-black bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50 focus:border-primary-400 transition-all tabular-nums shadow-sm" />
                    </div>
                    {change > 0 && (
                        <div className="flex justify-between items-center px-4 py-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100/50 animate-slideIn">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t('pos.changeReturn')}</span>
                            <span className="text-base font-black text-emerald-700 tabular-nums">Rp {change.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>

                {/* Checkout Button */}
                <button onClick={handleCheckout}
                    disabled={isEmpty || processing || paidAmount < total}
                    className="w-full py-5 bg-gradient-to-r from-primary-600 to-violet-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:shadow-xl hover:shadow-primary-200/50 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none disabled:from-slate-100 disabled:to-slate-100 transition-all active:scale-[0.98] shadow-lg shadow-primary-100">
                    {processing ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            {t('pos.processing')}
                        </span>
                    ) : t('pos.completeTransaction')}
                </button>
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default Cart;
