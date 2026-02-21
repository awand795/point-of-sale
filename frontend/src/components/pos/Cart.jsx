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
                payment_method: paymentMethod
            });

            alert('Transaction successful');
            clearCart();
            setPaidAmount(0);
            setDiscount(0);
            setTax(0);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create transaction');
        }
        setProcessing(false);
    }

    const paymentMethods = [
        { value: 'cash', label: 'Cash', icon: <Banknote size={14} /> },
        { value: 'debit', label: 'Debit', icon: <CreditCard size={14} /> },
        { value: 'credit', label: 'Credit', icon: <CreditCard size={14} /> },
        { value: 'qris', label: 'QRIS', icon: <Wallet size={14} /> },
    ];

    return (
        <div className="h-full flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-between shrink-0">
                <h2 className="font-semibold flex items-center text-sm">
                    <ShoppingCart size={17} className="mr-2" /> Shopping Cart
                </h2>
                {itemCount > 0 && (
                    <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {itemCount} item{itemCount > 1 ? 's' : ''}
                    </span>
                )}
            </div>

            {/* Items - scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <ShoppingCart size={40} className="mb-2" />
                        <p className="text-sm text-slate-400">Cart is empty</p>
                        <p className="text-xs text-slate-300 mt-1">Add products to get started</p>
                    </div>
                ) : (
                    items.map((item) => (
                        <div key={item.id} className="flex items-center py-2.5 border-b border-slate-100 last:border-0">
                            <div className="flex-1 min-w-0 mr-2">
                                <h3 className="text-sm font-medium text-slate-800 truncate">{item.name}</h3>
                                <p className="text-xs text-slate-400">
                                    Rp {(item.price || 0).toLocaleString('id-ID')} x {item.quantity}
                                </p>
                                <p className="text-sm font-semibold text-primary-600">
                                    Rp {((item.price || 0) * item.quantity).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center shrink-0">
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                >
                                    <Minus size={13} />
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-slate-700">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                >
                                    <Plus size={13} />
                                </button>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 ml-1 transition"
                                >
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer - sticky bottom */}
            <div className="shrink-0 border-t border-slate-200 bg-slate-50/80 px-4 py-3 space-y-2.5">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-700">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <div className="flex gap-2">
                    <input
                        type="number"
                        placeholder="Discount"
                        value={discount || ''}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-1/2 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <input
                        type="number"
                        placeholder="Tax"
                        value={tax || ''}
                        onChange={(e) => setTax(Number(e.target.value))}
                        className="w-1/2 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>

                <div className="flex justify-between font-bold text-base">
                    <span className="text-slate-800">Total</span>
                    <span className="text-primary-600">Rp {total.toLocaleString('id-ID')}</span>
                </div>

                {/* Payment method pills */}
                <div className="flex gap-1.5">
                    {paymentMethods.map((method) => (
                        <button
                            key={method.value}
                            onClick={() => setPaymentMethod(method.value)}
                            className={`flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg border transition ${
                                paymentMethod === method.value
                                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                        >
                            {method.icon}
                            {method.label}
                        </button>
                    ))}
                </div>

                <input
                    type="number"
                    placeholder="Paid Amount"
                    value={paidAmount || ''}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />

                {change >= 0 && paidAmount > 0 && (
                    <div className="flex justify-between text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                        <span>Change</span>
                        <span>Rp {change.toLocaleString('id-ID')}</span>
                    </div>
                )}

                <button
                    onClick={handleCheckout}
                    disabled={isEmpty || processing}
                    className="w-full py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
                >
                    {processing ? 'Processing...' : `Checkout (Rp ${total.toLocaleString('id-ID')})`}
                </button>
            </div>
        </div>
    );
}

export default Cart;
