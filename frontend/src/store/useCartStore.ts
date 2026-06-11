import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const CART_STORAGE_KEY = 'pos_cart_v2';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],
            
            // Actions
            addToCart: (product, quantity = 1) => {
                const { items } = get();
                const existingItem = items.find(item => item.id === product.id);

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.id === product.id 
                                ? { ...item, quantity: item.quantity + quantity } 
                                : item
                        ),
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                id: product.id,
                                name: product.name,
                                price: product.selling_price,
                                purchase_price: product.purchase_price,
                                image: product.image,
                                quantity: quantity,
                                stock: product.stock,
                            },
                        ],
                    });
                }
            },

            removeFromCart: (productId) => {
                set(state => ({
                    items: state.items.filter(item => item.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                set(state => ({
                    items: state.items.map(item =>
                        item.id === productId ? { ...item, quantity } : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [] });
            },

            // Selectors / Helpers
            getCartStats: () => {
                const { items } = get();
                const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
                const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
                return { subtotal, itemCount, isEmpty: items.length === 0 };
            },

            calculateTotal: (discount = 0, tax = 0) => {
                const { subtotal } = get().getCartStats();
                return subtotal - discount + tax;
            },

            getCartItemsForApi: () => {
                return get().items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                }));
            },
        }),
        {
            name: CART_STORAGE_KEY,
        }
    )
);
