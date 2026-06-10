import { useState, useRef } from 'react';
import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { ShoppingCart, Store, X as XIcon, ChevronDown } from 'lucide-react';

const POS = () => {
    const { t, locale } = useLanguage();
    const { isDemo } = useAuth();
    const cart = useCart();
    const [cartOpen, setCartOpen] = useState(true);

    // Swipe to close
    const [dragY, setDragY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const touchStartY = useRef(0);
    const panelRef = useRef(null);
    const SWIPE_THRESHOLD = 100;

    const handleTouchStart = (e) => {
        touchStartY.current = e.touches[0].clientY;
        setDragging(true);
    };

    const handleTouchMove = (e) => {
        if (!dragging) return;
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY.current;
        setDragY(Math.max(0, diff));
    };

    const handleTouchEnd = () => {
        setDragging(false);
        if (dragY > SWIPE_THRESHOLD) setCartOpen(false);
        setDragY(0);
    };

    return (
        <div className="h-[calc(100vh-5rem)] flex flex-col gap-4">
            {/* Top Bar — premium card container */}
            <div className="flex items-center justify-between px-1 py-0.5">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <Store size={18} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                        <h1 className="text-[16px] font-semibold tracking-[-0.01em] text-slate-900 dark:text-white flex items-center gap-2">
                            {t('pos.title')}
                            {isDemo && (
                                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-medium rounded border border-amber-200 dark:border-amber-700/50">
                                    DEMO
                                </span>
                            )}
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{t('pos.subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Register status pill */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-white/[0.08] rounded-lg shadow-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full">
                            <span className="sr-only">Active</span>
                        </div>
                        <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">{t('pos.activeOnline')}</span>
                    </div>
                    {/* Mobile cart toggle */}
                    <button
                        onClick={() => setCartOpen(!cartOpen)}
                        className="xl:hidden relative w-10 h-10 bg-white dark:bg-[#161B22] border border-slate-200 dark:border-white/[0.08] rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-500 transition-all"
                    >
                        <ShoppingCart size={18} />
                        {cart.itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-[9px] font-semibold rounded-full flex items-center justify-center shadow-sm">
                                {cart.itemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden xl:grid xl:grid-cols-12 gap-4 flex-1 min-h-0">
                <div className={`${cartOpen ? 'xl:col-span-8' : 'xl:col-span-12'} flex flex-col min-h-0 transition-all duration-300`}>
                    <ProductGrid onAddToCart={cart.addToCart} />
                </div>
                <div className={`${cartOpen ? 'xl:col-span-4' : 'xl:hidden'} min-h-0 transition-all duration-300`}>
                    <Cart cart={cart} />
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="xl:hidden flex-1 min-h-0">
                <ProductGrid onAddToCart={cart.addToCart} />
            </div>

            {/* Mobile Cart Bottom Sheet */}
            {cartOpen && (
                <div className="xl:hidden fixed inset-0 z-50 flex flex-col pointer-events-none" style={{ touchAction: 'none' }}>
                    <div className="flex-1 bg-black/30 dark:bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={() => setCartOpen(false)} />
                    <div
                        ref={panelRef}
                        className={`h-[70vh] pointer-events-auto flex flex-col bg-white dark:bg-[#0D1117] rounded-t-2xl shadow-2xl shadow-black/20 dark:shadow-black/40 ${dragging ? '' : 'animate-slideUp'}`}
                        style={{
                            transform: dragging ? `translateY(${dragY}px)` : undefined,
                            transition: dragging ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
                        }}
                    >
                        <div
                            className="shrink-0 flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.08]"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full" />
                                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">{t('pos.currentOrder')}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {cart.itemCount > 0 && (
                                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">{cart.itemCount} items</span>
                                )}
                                <button onClick={() => setCartOpen(false)} className="w-7 h-7 bg-slate-100 dark:bg-white/[0.06] rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 min-h-0">
                            <Cart cart={cart} />
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Cart Button (mobile, when cart is closed) */}
            {!cartOpen && cart.itemCount > 0 && (
                <button
                    onClick={() => setCartOpen(true)}
                    className="xl:hidden fixed bottom-6 right-6 z-40 bg-[#FF6B35] text-white px-5 py-3.5 rounded-2xl shadow-xl shadow-[#FF6B35]/30 flex items-center gap-3 active:scale-95 transition-transform"
                    style={{ animation: 'fadeInUp 0.4s ease-out' }}
                >
                    <ShoppingCart size={18} />
                    <span className="font-medium text-sm">{cart.itemCount} items — Rp {cart.subtotal.toLocaleString('id-ID')}</span>
                </button>
            )}

            <style>{`
                @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
                @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-slideUp { animation: slideUp 0.35s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default POS;
