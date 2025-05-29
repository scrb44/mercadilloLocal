// src/context/CartContext.tsx - VERSIÓN SIMPLIFICADA
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import mercadilloService from "../services";
import {
    type ProductInterface,
    type CartItemInterface,
    type CartContextType,
} from "../types/types";

// ============ CONTEXT ============
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============ PROVIDER SIMPLIFICADO ============
interface CartProviderProps {
    children: ReactNode;
    userId: string | number;
}

export const CartProvider: React.FC<CartProviderProps> = ({
    children,
    userId,
}) => {
    const [items, setItems] = useState<CartItemInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calcular totales automáticamente
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Cargar carrito al inicializar
    useEffect(() => {
        if (!userId) return;

        const loadCart = async () => {
            try {
                setLoading(true);
                const cart = await mercadilloService.getCart(userId);
                setItems(cart.products);
            } catch (err: any) {
                setError("Error al cargar el carrito");
                console.error("Error loading cart:", err);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [userId]);

    // ============ FUNCIONES DEL CARRITO ============
    const addItem = async (product: ProductInterface, quantity: number = 1) => {
        try {
            setError(null);

            // Actualización optimista (inmediata en UI)
            const existingItemIndex = items.findIndex(
                (item) => item.product.id === product.id
            );

            if (existingItemIndex >= 0) {
                const newItems = [...items];
                newItems[existingItemIndex].quantity += quantity;
                setItems(newItems);
            } else {
                setItems([...items, { product, quantity }]);
            }

            // Sincronizar con backend
            await mercadilloService.addToCart(userId, product.id, quantity);
        } catch (err: any) {
            setError("Error al añadir producto al carrito");
            // Revertir cambio optimista cargando desde servidor
            try {
                const cart = await mercadilloService.getCart(userId);
                setItems(cart.products);
            } catch (revertError) {
                console.error(
                    "Error reverting optimistic update:",
                    revertError
                );
            }
        }
    };

    const removeItem = async (productId: number) => {
        try {
            setError(null);

            // Actualización optimista
            setItems(items.filter((item) => item.product.id !== productId));

            // Sincronizar con backend
            await mercadilloService.removeFromCart(userId, productId);
        } catch (err: any) {
            setError("Error al eliminar producto del carrito");
            // Revertir cambio
            try {
                const cart = await mercadilloService.getCart(userId);
                setItems(cart.products);
            } catch (revertError) {
                console.error("Error reverting:", revertError);
            }
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity <= 0) {
            return removeItem(productId);
        }

        try {
            setError(null);

            // Actualización optimista
            const newItems = items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            );
            setItems(newItems);

            // Sincronizar con backend
            await mercadilloService.updateCartQuantity(
                userId,
                productId,
                quantity
            );
        } catch (err: any) {
            setError("Error al actualizar cantidad");
            // Revertir cambio
            try {
                const cart = await mercadilloService.getCart(userId);
                setItems(cart.products);
            } catch (revertError) {
                console.error("Error reverting:", revertError);
            }
        }
    };

    const clearCart = async () => {
        try {
            setError(null);
            setItems([]);
            await mercadilloService.clearCart(userId);
        } catch (err: any) {
            setError("Error al vaciar el carrito");
            // Recargar carrito
            try {
                const cart = await mercadilloService.getCart(userId);
                setItems(cart.products);
            } catch (revertError) {
                console.error("Error reloading cart:", revertError);
            }
        }
    };

    // ============ FUNCIONES DE UTILIDAD ============
    const getItemQuantity = (productId: number): number => {
        const item = items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    const isInCart = (productId: number): boolean => {
        return items.some((item) => item.product.id === productId);
    };

    // ============ VALOR DEL CONTEXT ============
    const contextValue: CartContextType = {
        items,
        totalItems,
        totalPrice,
        loading,
        error,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemQuantity,
        isInCart,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// ============ HOOK ============
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default CartContext;
