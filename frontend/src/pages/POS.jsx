import { useState } from 'react';
import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Store, Wifi } from 'lucide-react';

const POS = () => {
    const { t } = useLanguage();
    const { isDemo } = useAuth();
    const cart = useCart();
    const [cartOpen, setCartOpen] = useState(true);

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-4">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {t('pos.title')}
                            {isDemo && (
                                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-amber-200">
                                    DEMO
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">{t('pos.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden sm:flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('pos.registerStatus')}</p>
                            <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 justify-end">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                </span>
                                {t('pos.activeOnline')}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100">
                            <Wifi size={18} className="text-white" />
                        </div>
                    </div>
                    <button
                        onClick={() => setCartOpen(!cartOpen)}
                        className="xl:hidden relative w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 transition-all"
                    >
                        <ShoppingCart size={20} />
                        {cart.itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-primary-200">
                                {cart.itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 flex-1 min-h-0">
                <div className={`${cartOpen ? 'xl:col-span-8' : 'xl:col-span-12'} flex flex-col min-h-0 transition-all duration-300`}>
                    <ProductGrid onAddToCart={cart.addToCart} />
                </div>
                <div className={`${cartOpen ? 'xl:col-span-4' : 'xl:hidden'} min-h-0 transition-all duration-300`}>
                    <Cart cart={cart} />
                </div>
            </div>

            {/* Floating Cart Button (mobile) */}
            {!cartOpen && cart.itemCount > 0 && (
                <button
                    onClick={() => setCartOpen(true)}
                    className="fixed bottom-6 right-6 xl:hidden z-50 bg-gradient-to-br from-primary-600 to-violet-600 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-primary-200 flex items-center gap-3 active:scale-95 transition-transform"
                    style={{ animation: 'fadeInUp 0.4s ease-out' }}
                >
                    <ShoppingCart size={20} />
                    <span className="font-bold text-sm">{cart.itemCount} items — Rp {cart.subtotal.toLocaleString('id-ID')}</span>
                </button>
            )}
        </div>
    );
};

export default POS;
