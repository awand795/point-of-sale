import { useState } from "react";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Wallet } from "lucide-react";
import { transactionApi } from "../../api/transactions";

const Cart = ({ cart }) => {
    const {
        items,
        updateQuantity,
        removeFromCart,
        subtotal,
        itemCount,
        calculateTotal,
        getCartItemsForApi,
        clearCart,
        isEmpty
    } = cart;

    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);
    const [note, setNote] = useState('');

    const total = calculateTotal(discount, tax);
    const change = paidAmount - total;

    const handleCheckout = async () => {
        if (isEmpty) return;
        if (paidAmount < total) {
            alert('Paid amount is less than total');
            return;
        }

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

            alert('Transaction successful');
            clearCart();
            setPaidAmount(0);
            setDiscount(0);
            setTax(0);
            setNote('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create transaction');
        }
        setProcessing(false);
    }

    const paymentMethods = [
        { value: 'cash', label: 'Cash', icon: <Banknote size={20} /> },
        { value: 'debit', label: 'Debit', icon: <CreditCard size={20} /> },
        { value: 'credit', label: 'Credit', icon: <CreditCard size={20} /> },
        { value: 'qris', label: 'QRIS', icon: <Wallet size={20} /> },
    ];

    return (
        <div className="h-full flex flex-col bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden relative">
            {/* Header */}
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
                <div>
                    <h2 className="font-bold flex items-center text-lg">
                        Current Order
                    </h2>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Customer: Walk-in</p>
                </div>
                {itemCount > 0 && (
                    <button 
                        onClick={clearCart}
                        className="p-2 bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-xl transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                )}
            </div>

            {/* Items - scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2 space-y-1">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart size={32} className="text-slate-200" />
                        </div>
                        <p className="text-sm font-bold text-slate-400">Your cart is empty</p>
                        <p className="text-xs text-slate-300 mt-1 text-center px-10">Add products from the list to start a new transaction</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="group flex items-center gap-3 p-3 rounded-2xl border border-transparent hover:border-slate-100 hover:bg-slate-50/50 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    item.name.substring(0, 2)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-slate-800 truncate">{item.name}</h3>
                                <p className="text-[11px] font-bold text-primary-600 mt-0.5">
                                    Rp {(item.price || 0).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition"
                                >
                                    <Minus size={12} />
                                </button>
                                <span className="w-4 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition"
                                >
                                    <Plus size={12} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer - sticky bottom */}
            <div className="shrink-0 border-t border-slate-100 bg-slate-50/30 px-6 py-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">DISC</span>
                            <input
                                type="number"
                                value={discount || ''}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className="w-full pl-12 pr-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                            />
                        </div>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300">TAX</span>
                            <input
                                type="number"
                                value={tax || ''}
                                onChange={(e) => setTax(Number(e.target.value))}
                                className="w-full pl-10 pr-3 py-2 text-xs font-bold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-400 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-end pb-2">
                    <span className="text-sm font-bold text-slate-800">Total Payable</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                {/* Payment method selection */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                    <div className="grid grid-cols-4 gap-2">
                        {paymentMethods.map((method) => (
                            <button
                                key={method.value}
                                onClick={() => setPaymentMethod(method.value)}
                                className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl border transition-all ${
                                    paymentMethod === method.value
                                        ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200'
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                }`}
                            >
                                {method.icon}
                                <span className="text-[9px] font-bold uppercase tracking-tighter">{method.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-300 uppercase tracking-widest">Received</span>
                        <input
                            type="number"
                            value={paidAmount || ''}
                            onChange={(e) => setPaidAmount(Number(e.target.value))}
                            className="w-full pl-24 pr-4 py-3.5 text-lg font-black bg-white border-2 border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary-50/50 focus:border-primary-400 transition-all"
                        />
                    </div>

                    {change > 0 && (
                        <div className="flex justify-between items-center px-4 py-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Change Return</span>
                            <span className="text-sm font-black text-emerald-700">Rp {change.toLocaleString('id-ID')}</span>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={isEmpty || processing || paidAmount < total}
                    className="w-full py-5 bg-primary-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-primary-700 disabled:bg-slate-100 disabled:text-slate-300 transition-all shadow-xl shadow-primary-100 active:scale-[0.98]"
                >
                    {processing ? 'Processing...' : 'Complete Transaction'}
                </button>
            </div>
        </div>
    );
}

export default Cart;
