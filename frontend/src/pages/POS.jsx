import ProductGrid from '../components/pos/ProductGrid';
import Cart from '../components/pos/Cart';
import { useCart } from '../hooks/useCart';

const POS = () => {
    const cart = useCart();

    return (
        <div className="h-[calc(100vh-5.5rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-slate-800">Point of Sale</h1>
                <p className="text-sm text-slate-500">Select products and process transactions</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 flex-1 min-h-0">
                <div className="lg:col-span-2 min-h-0">
                    <ProductGrid onAddToCart={cart.addToCart} />
                </div>
                <div className="min-h-0">
                    <Cart cart={cart} />
                </div>
            </div>
        </div>
    );
}

export default POS;
