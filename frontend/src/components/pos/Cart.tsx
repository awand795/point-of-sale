import { useState, useRef, useEffect } from "react";
import { Minus, Plus, Trash2, ShoppingCart, CreditCard, Banknote, Smartphone, X, Check, Wallet, Printer, Receipt, Search, UserCircle, ChevronDown } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";
import { transactionApi } from "../../api/transactions";
import { useCustomers } from "../../hooks/useCustomers";

const Cart = ({ cart }) => {
    const { t, locale } = useLanguage();
    const { items, updateQuantity, removeFromCart, subtotal, itemCount, calculateTotal, getCartItemsForApi, clearCart, isEmpty } = cart;

    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [paidAmount, setPaidAmount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [processing, setProcessing] = useState(false);
    const [note, setNote] = useState('');
    const [receiptData, setReceiptData] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerDropdownOpen, setCustomerDropdownOpen] = useState(false);
    const [customerSearch, setCustomerSearch] = useState('');
    const customerDropdownRef = useRef(null);
    const { customers, loading: customersLoading } = useCustomers({ per_page: 50 });

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (customerDropdownRef.current && !customerDropdownRef.current.contains(e.target)) {
                setCustomerDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredCustomers = customers.filter(c =>
        !customerSearch ||
        c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone?.includes(customerSearch) ||
        c.email?.toLowerCase().includes(customerSearch.toLowerCase())
    );

    const total = calculateTotal(discount, tax);
    const change = paidAmount - total;
    const isValidPayment = paidAmount >= total;

    const getPaymentMethodInfo = (method) => {
        const found = paymentMethods.find(p => p.value === method);
        const iconMap = {
            cash: <Banknote size={14} />,
            debit: <CreditCard size={14} />,
            credit: <CreditCard size={14} />,
            qris: <Smartphone size={14} />,
        };
        return {
            label: found ? found.label : method,
            icon: iconMap[method] || <Banknote size={14} />
        };
    };

    const handleCheckout = async () => {
        if (isEmpty) return;
        if (paidAmount < total) return;
        setProcessing(true);
        try {
            const response = await transactionApi.create({
                items: getCartItemsForApi(),
                discount,
                tax,
                paid_amount: paidAmount,
                payment_method: paymentMethod,
                notes: note,
                customer_id: selectedCustomer?.id || null,
            });

            const invoiceData = response?.data?.invoice_number
                ? `INV-${String(response.data.invoice_number).padStart(5, '0')}`
                : `INV-${Date.now().toString(36).toUpperCase()}`;

            setReceiptData({
                invoice: invoiceData,
                date: new Date(),
                items: [...items],
                subtotal,
                discount,
                tax,
                total,
                paidAmount,
                change,
                paymentMethod,
                note: note,
                customer: selectedCustomer,
            });
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create transaction');
        }
        setProcessing(false);
    };

    const handleCloseReceipt = () => {
        clearCart();
        setPaidAmount(0);
        setDiscount(0);
        setTax(0);
        setNote('');
        setSelectedCustomer(null);
        setCustomerSearch('');
        setReceiptData(null);
    };

    const handlePrintReceipt = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            window.print();
            return;
        }

        const formatPrice = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`;
        const payLabel = paymentMethodLabels[paymentMethod]?.[locale] || paymentMethod;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Receipt - ${receiptData.invoice}</title>
                <style>
                    @page { margin: 0; size: 80mm auto; }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Courier New', monospace;
                        font-size: 12px;
                        width: 80mm;
                        padding: 10px 8px;
                        color: #000;
                    }
                    .header { text-align: center; margin-bottom: 12px; }
                    .header h1 { font-size: 18px; font-weight: bold; letter-spacing: 2px; }
                    .header p { font-size: 10px; color: #555; margin-top: 2px; }
                    .divider { border-top: 1px dashed #000; margin: 8px 0; }
                    .info { font-size: 10px; margin-bottom: 8px; }
                    .info-row { display: flex; justify-content: space-between; }
                    table { width: 100%; border-collapse: collapse; font-size: 11px; }
                    th { text-align: left; font-size: 9px; text-transform: uppercase; padding-bottom: 4px; }
                    th.qty { width: 40px; text-align: center; }
                    th.price { width: 70px; text-align: right; }
                    td { padding: 2px 0; vertical-align: top; }
                    td.qty { text-align: center; }
                    td.price { text-align: right; }
                    .item-name { font-size: 11px; }
                    .totals { margin-top: 4px; }
                    .totals-row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; }
                    .totals-row.total { font-size: 14px; font-weight: bold; border-top: 2px solid #000; padding-top: 4px; margin-top: 2px; }
                    .payment { margin-top: 8px; }
                    .payment-row { display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0; }
                    .footer { text-align: center; margin-top: 16px; font-size: 10px; }
                    .footer p { margin-top: 2px; }
                    @media print {
                        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>BikinPOS</h1>
                    <p>Point of Sale Terminal</p>
                </div>
                <div class="divider"></div>
                <div class="info">
                    <div class="info-row">
                        <span>${receiptData.invoice}</span>
                        <span>${receiptData.date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style="margin-top: 4px;">Kasir: Walk-in Customer</div>
                    ${receiptData.customer ? `<div style="margin-top: 4px;">Pelanggan: ${receiptData.customer.name}</div>` : ''}
                    ${receiptData.note ? `<div style="margin-top: 4px; font-style: italic;">${locale === 'id' ? 'Catatan' : 'Notes'}: ${receiptData.note}</div>` : ''}
                </div>
                <div class="divider"></div>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th class="qty">Qty</th>
                            <th class="price">Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${receiptData.items.map(item => `
                            <tr>
                                <td><div class="item-name">${item.name}</div></td>
                                <td class="qty">${item.quantity}x</td>
                                <td class="price">${formatPrice(item.price * item.quantity)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="divider"></div>
                <div class="totals">
                    <div class="totals-row">
                        <span>Subtotal</span>
                        <span>${formatPrice(receiptData.subtotal)}</span>
                    </div>
                    ${receiptData.discount > 0 ? `
                    <div class="totals-row">
                        <span>Discount</span>
                        <span>-${formatPrice(receiptData.discount)}</span>
                    </div>` : ''}
                    ${receiptData.tax > 0 ? `
                    <div class="totals-row">
                        <span>Tax</span>
                        <span>+${formatPrice(receiptData.tax)}</span>
                    </div>` : ''}
                    <div class="totals-row total">
                        <span>TOTAL</span>
                        <span>${formatPrice(receiptData.total)}</span>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="payment">
                    <div class="payment-row">
                        <span>${payLabel}</span>
                        <span>${formatPrice(receiptData.paidAmount)}</span>
                    </div>
                    <div class="payment-row">
                        <span>Kembalian</span>
                        <span>${formatPrice(receiptData.change)}</span>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="footer">
                    <p>Terima kasih! / Thank you!</p>
                    <p style="font-size: 8px; margin-top: 4px;">www.bikinpos.com</p>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                <\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    const paymentMethods = [
        { value: 'cash', label: 'Cash', icon: <Banknote size={18} /> },
        { value: 'debit', label: 'Debit', icon: <CreditCard size={18} /> },
        { value: 'credit', label: 'Credit', icon: <CreditCard size={18} /> },
        { value: 'qris', label: 'QRIS', icon: <Smartphone size={18} /> },
    ];

    const paymentMethodLabels = {
        cash: { id: 'Tunai', en: 'Cash' },
        debit: { id: 'Debit', en: 'Debit' },
        credit: { id: 'Kredit', en: 'Credit' },
        qris: { id: 'QRIS', en: 'QRIS' },
    };

    const formatPrice = (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`;

    return (
        <div className="h-full flex flex-col bg-white dark:bg-[#161B22] rounded-xl border border-slate-200/60 dark:border-white/[0.06] shadow-xl dark:shadow-slate-900/50 overflow-hidden relative transition-colors duration-300">
            {/* Receipt Preview Overlay */}
            {receiptData && (
                <div className="absolute inset-0 z-50 bg-white dark:bg-slate-800 animate-fadeIn flex flex-col print:static">
                    {/* Receipt Header */}
                    <div className="shrink-0 px-5 py-4 bg-slate-900 text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                <Check size={18} className="text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="font-bold text-sm">{t('pos.receiptSuccess')}</h2>
                                <p className="text-[9px] text-slate-400 font-medium uppercase tracking-widest">{receiptData.invoice}</p>
                            </div>
                        </div>
                    </div>

                    {/* Receipt Content */}                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
                        {/* Store header */}
                        <div className="text-center border-b border-dashed border-slate-200 dark:border-white/[0.08] pb-4">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">BikinPOS</h3>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Point of Sale Terminal</p>
                        </div>

                        {/* Invoice info */}
                        <div className="flex justify-between text-[11px]">
                            <div>
                                <p className="font-bold text-slate-700 dark:text-slate-300">{receiptData.invoice}</p>
                                <p className="text-slate-400 dark:text-slate-500 mt-0.5">{t('pos.receiptCashier')}: Walk-in</p>
                                {receiptData.customer && (
                                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{receiptData.customer.name}</p>
                                )}
                            </div>
                            <div className="text-right text-slate-400 dark:text-slate-500">
                                <p>{receiptData.date.toLocaleDateString(locale === 'id' ? 'id-ID' : 'en-US', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}</p>
                                <p>{receiptData.date.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', {
                                    hour: '2-digit', minute: '2-digit'
                                })}</p>
                            </div>
                        </div>

                        {/* Notes */}
                        {receiptData.note && (
                            <div className="px-3 py-2.5 bg-slate-50/80 dark:bg-slate-700/50 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">{t('pos.noteLabel')}</p>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">{receiptData.note}</p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                        {/* Items header */}
                        <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            <div className="flex-1">{t('pos.receiptItem')}</div>
                            <div className="w-10 text-center">{t('pos.receiptQty')}</div>
                            <div className="w-24 text-right">Subtotal</div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-2">
                            {receiptData.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm animate-slideIn" style={{ animationDelay: `${idx * 40}ms` }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-slate-800 dark:text-slate-200 truncate text-xs">{item.name}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500">{formatPrice(item.price)}</p>
                                    </div>
                                    <div className="w-10 text-center">
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{item.quantity}x</span>
                                    </div>
                                    <div className="w-24 text-right">
                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                        {/* Totals */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 dark:text-slate-500">Subtotal</span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">{formatPrice(receiptData.subtotal)}</span>
                            </div>
                            {receiptData.discount > 0 && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 dark:text-slate-500">Discount</span>
                                    <span className="font-bold text-red-500 tabular-nums">-{formatPrice(receiptData.discount)}</span>
                                </div>
                            )}
                            {receiptData.tax > 0 && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400 dark:text-slate-500">Tax</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">+{formatPrice(receiptData.tax)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2 border-t-2 border-slate-800 dark:border-slate-600">
                                <span className="text-sm font-black text-slate-800 dark:text-white">TOTAL</span>
                                <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums">{formatPrice(receiptData.total)}</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

                        {/* Payment info */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                                <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                    {getPaymentMethodInfo(receiptData.paymentMethod).icon}
                                    {getPaymentMethodInfo(receiptData.paymentMethod).label}
                                </span>
                                <span className="font-bold text-slate-700 dark:text-slate-300 tabular-nums">{formatPrice(receiptData.paidAmount)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 dark:text-slate-500">{t('pos.changeReturn')}</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatPrice(receiptData.change)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                {t('pos.receiptThankYou')}
                            </p>
                            <p className="text-[8px] text-slate-300 dark:text-slate-600 mt-0.5">www.bikinpos.com</p>
                        </div>
                    </div>

                    {/* Receipt Actions */}
                    <div className="shrink-0 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/80 dark:bg-slate-800/80 px-4 py-3 flex gap-2">
                        <button onClick={handlePrintReceipt}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-300 font-medium text-sm rounded-lg hover:border-primary-400 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-all active:scale-[0.97]"
                        >
                            <Printer size={16} />
                            {t('pos.receiptPrint')}
                        </button>
                        <button onClick={handleCloseReceipt}
                            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-primary-500 text-white font-medium text-sm rounded-lg hover:bg-primary-600 transition-all active:scale-[0.97] shadow-sm"
                        >
                            <Receipt size={16} />
                            {t('pos.receiptNewTransaction')}
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="shrink-0 px-4 py-3 bg-white dark:bg-[#161B22] border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 bg-primary-500/10 rounded-lg flex items-center justify-center">
                            <ShoppingCart size={14} className="text-primary-500" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('pos.currentOrder')}</h2>
                            <p className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
                                {t('pos.customer')}:
                                <span className="relative" ref={customerDropdownRef}>
                                    <button
                                        onClick={() => setCustomerDropdownOpen(!customerDropdownOpen)}
                                        className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        <UserCircle size={12} />
                                        <span>{selectedCustomer?.name || 'Walk-in'}</span>
                                        <ChevronDown size={10} className={`transition-transform duration-200 ${customerDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {customerDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden z-50 animate-fadeIn">
                                            {/* Search */}
                                            <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                                                <div className="relative">
                                                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        type="text"
                                                        value={customerSearch}
                                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                                        placeholder={t('pos.customerSearch')}
                                                        className="w-full pl-7 pr-2 py-1.5 text-[10px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-900/50 focus:border-primary-400 dark:focus:border-primary-500 dark:text-slate-200 dark:placeholder-slate-400"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Customers list */}
                                            <div className="max-h-48 overflow-y-auto">
                                                {customersLoading ? (
                                                    <div className="px-3 py-4 text-center">
                                                        <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
                                                    </div>
                                                ) : filteredCustomers.length === 0 ? (
                                                    <div className="px-3 py-4 text-center text-[10px] text-slate-400 dark:text-slate-500">
                                                        {t('pos.customerNoResults')}
                                                    </div>
                                                ) : (
                                                    filteredCustomers.map((c) => (
                                                        <button
                                                            key={c.id}
                                                            onClick={() => {
                                                                setSelectedCustomer(c);
                                                                setCustomerDropdownOpen(false);
                                                                setCustomerSearch('');
                                                            }}
                                                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left text-xs transition-colors hover:bg-primary-50/50 dark:hover:bg-primary-900/20 ${
                                                                selectedCustomer?.id === c.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold' : 'text-slate-700 dark:text-slate-300'
                                                            }`}
                                                        >
                                                            <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[8px] font-bold text-slate-500 shrink-0">
                                                                {c.name?.charAt(0)?.toUpperCase() || '?'}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{c.name}</p>
                                                                {c.phone && <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">{c.phone}</p>}
                                                            </div>
                                                        </button>
                                                    ))
                                                )}
                                            </div>

                                            {/* Clear selection */}
                                            {selectedCustomer && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedCustomer(null);
                                                        setCustomerDropdownOpen(false);
                                                        setCustomerSearch('');
                                                    }}
                                                    className="w-full px-3 py-2 text-[9px] font-bold text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors uppercase tracking-wider border-t border-slate-100 dark:border-slate-700"
                                                >
                                                    {t('pos.customerRemove')}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {itemCount > 0 && (
                            <span className="px-2.5 py-1 bg-primary-500/10 rounded-lg text-[10px] font-bold text-primary-600 dark:text-primary-400 tabular-nums">
                                {itemCount} items
                            </span>
                        )}
                        {itemCount > 0 && (
                            <button onClick={clearCart}
                                className="p-2 bg-slate-100 dark:bg-white/[0.06] hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition-all active:scale-90">
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2 space-y-0.5 scrollbar-thin">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-200 dark:text-slate-600">
                        <div className="w-16 h-16 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4 border border-dashed border-slate-200 dark:border-slate-600">
                            <ShoppingCart size={28} className="text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">{t('pos.cartEmpty')}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{t('pos.cartEmptyDesc')}</p>
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <div key={item.id}
                            className="group flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-150 animate-slideIn"
                            style={{ animationDelay: `${idx * 30}ms` }}
                        >
                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold text-[10px] uppercase shadow-sm">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                    item.name.substring(0, 2)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-1">
                                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{item.name}</h3>
                                    <button onClick={() => removeFromCart(item.id)}
                                        className="p-0.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-all shrink-0">
                                        <X size={12} />
                                    </button>
                                </div>
                                <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 mt-0.5">
                                    Rp {(item.price || 0).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 bg-white dark:bg-slate-700 p-0.5 rounded-lg shadow-sm border border-slate-100 dark:border-slate-600">
                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition active:scale-90">
                                    <Minus size={13} />
                                </button>
                                <span className="w-6 text-center text-xs font-semibold text-slate-700 dark:text-slate-200 tabular-nums">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition active:scale-90">
                                    <Plus size={13} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Checkout Footer - Compact */}
            {!receiptData && (
            <div className="shrink-0 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 px-4 py-3 space-y-2.5 transition-colors">
                {/* Totals Row */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center justify-between px-3 py-2 bg-white dark:bg-slate-700 rounded-xl border border-slate-100 dark:border-slate-600 shadow-sm">
                        <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('pos.subtotal')}</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 tabular-nums">Rp {subtotal.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="w-16 shrink-0">
                        <input type="number" value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value))}
                            placeholder="Disc"
                            className="w-full px-2.5 py-2 text-[10px] font-bold border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-900/50 focus:border-primary-400 dark:focus:border-primary-500 transition-all bg-white dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500 text-center tabular-nums"
                        />
                    </div>
                    <div className="w-16 shrink-0">
                        <input type="number" value={tax || ''} onChange={(e) => setTax(Number(e.target.value))}
                            placeholder="Tax"
                            className="w-full px-2.5 py-2 text-[10px] font-bold border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-900/50 focus:border-primary-400 dark:focus:border-primary-500 transition-all bg-white dark:bg-slate-700 dark:text-slate-200 dark:placeholder-slate-500 text-center tabular-nums"
                        />
                    </div>
                </div>

                {/* Total Payable */}
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-900 dark:bg-[#1a1f2e] rounded-xl shadow-sm">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{t('pos.totalPayable')}</span>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-white tracking-tight tabular-nums">Rp {total.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                {/* Notes */}
                {items.length > 0 && (
                    <div>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={processing}
                            placeholder={t('pos.notesPlaceholder')}
                            rows={1}
                            className="w-full disabled:bg-slate-50 dark:disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed px-3 py-2 text-[10px] font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-900/50 focus:border-primary-400 dark:focus:border-primary-500 transition-all placeholder:text-slate-300 dark:placeholder-slate-500 resize-none overflow-hidden"
                            onInput={(e) => {
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 64) + 'px';
                            }}
                        />
                    </div>
                )}

                {/* Payment Method */}
                <div className="flex items-center gap-1.5">
                    {paymentMethods.map((method) => (
                        <button key={method.value}
                            onClick={() => setPaymentMethod(method.value)}
                            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 rounded-xl border transition-all duration-150 active:scale-95 ${
                                paymentMethod === method.value
                                    ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-400 dark:text-slate-500 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                            }`}
                        >
                            {method.icon}
                            <span className="text-[7px] font-bold uppercase tracking-tight">{method.label}</span>
                        </button>
                    ))}
                </div>

                {/* Quick Amount Buttons */}
                {items.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        {[10000, 20000, 50000, 100000].map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setPaidAmount(amount)}
                                className={`flex-1 px-2 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-150 active:scale-95 ${
                                    paidAmount === amount
                                        ?                        'bg-primary-500 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
                                }`}
                            >
                                Rp {(amount).toLocaleString('id-ID')}
                            </button>
                        ))}
                        <button
                            onClick={() => setPaidAmount(total)}
                            className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-150 active:scale-95 ${
                                paidAmount === total
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-emerald-300 dark:hover:border-emerald-600 hover:text-emerald-600 dark:hover:text-emerald-400'
                            }`}
                        >
                            {t('pos.exactAmount')}
                        </button>
                    </div>
                )}

                {/* Received Amount */}
                <div>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('pos.received')}</span>
                        <input type="number" value={paidAmount || ''} onChange={(e) => setPaidAmount(Number(e.target.value))}
                            className="w-full pl-16 pr-3 h-11 text-sm font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-50 dark:focus:ring-primary-900/50 focus:border-primary-400 dark:focus:border-primary-500 transition-all tabular-nums dark:text-slate-200"
                        />
                    </div>
                </div>

                {/* Change Return */}
                {change > 0 && (
                    <div className="flex justify-between items-center px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl border border-emerald-100/50 dark:border-emerald-700/50 animate-slideIn">
                        <span className="flex items-center gap-2">
                            <Wallet size={14} className="text-emerald-500 dark:text-emerald-400" />
                            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{t('pos.changeReturn')}</span>
                        </span>
                        <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">Rp {change.toLocaleString('id-ID')}</span>
                    </div>
                )}

                {/* Checkout Button — FULL WIDTH, BIG */}
                <button
                    onClick={handleCheckout}
                    disabled={isEmpty || processing || !isValidPayment}
                    className="w-full py-3.5 bg-[#FF6B35] hover:bg-[#E55A2B] disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed text-white text-[15px] font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-md shadow-[#FF6B35]/25"
                >
                    {processing ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : <CreditCard size={18} />}
                    <span>{processing ? t('pos.processing') : `${t('pos.completeTransaction')} — Rp ${total.toLocaleString('id-ID')}`}</span>
                </button>
            </div>
            )}

            {/* Animations */}
            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
                .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
                .scrollbar-thin::-webkit-scrollbar { width: 3px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #475569; }
                .scrollbar-thin { scrollbar-width: thin; }
            `}</style>
        </div>
    );
};

export default Cart;
