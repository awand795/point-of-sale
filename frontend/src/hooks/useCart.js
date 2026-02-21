import {useState, useCallback, useEffect} from 'react';

const CART_STORAGE_KEY = 'pos_cart';

export const useCart = () => {
    const [items, setItems] = useState(() => {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        // Filter out corrupt items (missing price from old data)
        return parsed.filter(item => item.price != null);
    });

    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = useCallback((product, quantity = 1) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === product.id);
            if (existingItem) {
                return currentItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...currentItems, {
                id: product.id,
                name: product.name,
                price: product.selling_price,
                purchase_price: product.purchase_price,
                image: product.image,
                quantity: 1,
                stock: product.stock,
            }];
        });
    }, []);

    const removeFromCart = useCallback((productId) => {
        setItems(currentItems => currentItems.filter(item => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, quantity) => { 
        if(quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(currentItems => currentItems.map(item => item.id === productId ? {...item, quantity} : item));
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
    }, []);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const calculateTotal = (discount = 0, tax = 0) => {
        return subtotal - discount + tax;
    };

    const getCartItemsForApi = () => {
        return items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
        }));
    };

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        calculateTotal,
        getCartItemsForApi,
        isEmpty: items.length === 0,
    };
};