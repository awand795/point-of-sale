import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import { useCart } from '../hooks/useCart';
import { useLanguage } from '../i18n/LanguageContext';

const POS = () => {
    const { t } = useLanguage();
    const cart = useCart();

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
            <div className="flex items-end justify-between px-1">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t('pos.title')}</h1>
                    <p className="text-sm text-slate-500 font-medium">{t('pos.subtitle')}</p>
                </div>
                <div className="hidden md:flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('pos.registerStatus')}</p>
                        <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 justify-end">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            {t('pos.activeOnline')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 flex-1 min-h-0">
                <div className="xl:col-span-8 flex flex-col min-h-0">
                    <ProductGrid onAddToCart={cart.addToCart} />
                </div>
                <div className="xl:col-span-4 min-h-0">
                    <Cart cart={cart} />
                </div>
            </div>
        </div>
    );
}

export default POS;
