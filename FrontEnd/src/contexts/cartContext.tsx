// src/context/CartContext.tsx - UNIVERSAL para todos los tipos de usuario
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import { cartService } from "../services/cartService";
import {
    type ProductInterface,
    type CartItemInterface,
    type CartContextType,
    type UserInterface,
} from "../types/types";

// ============ CONTEXT ============
const CartContext = createContext<CartContextType | undefined>(undefined);

// ============ PROVIDER UNIVERSAL ============
interface CartProviderProps {
    children: ReactNode;
    user: UserInterface | null;
}

export const CartProvider: React.FC<CartProviderProps> = ({
    children,
    user,
}) => {
    const [items, setItems] = useState<CartItemInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ CAMBIADO: Ahora TODOS los usuarios autenticados pueden usar carrito
    const canUseCart = user !== null && user.id;

    // Calcular totales automáticamente
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // ✅ Cargar carrito para CUALQUIER usuario autenticado
    useEffect(() => {
        if (!canUseCart) {
            setItems([]);
            return;
        }

        const loadCart = async () => {
            try {
                setLoading(true);
                setError(null);

                const cart = await cartService.getCart(user.id);
                setItems(cart.products || []);
            } catch (err: any) {
                console.error("❌ Error cargando carrito:", err);

                // Manejar errores específicos
                if (
                    err.message?.includes("Sesión expirada") ||
                    err.message?.includes("Token")
                ) {
                    setError(
                        "Tu sesión ha expirado. Inicia sesión nuevamente."
                    );
                } else if (err.message?.includes("permisos")) {
                    setError("No tienes permisos para acceder al carrito.");
                } else if (err.message?.includes("conexión")) {
                    setError("Error de conexión. Revisa tu internet.");
                } else {
                    setError("Error al cargar el carrito");
                }

                setItems([]); // Carrito vacío en caso de error
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [user?.id, canUseCart]);

    // ============ FUNCIONES DEL CARRITO ============
    const addItem = async (product: ProductInterface, quantity: number = 1) => {
        if (!canUseCart) {
            setError("Debes iniciar sesión para agregar productos al carrito");
            return;
        }

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
            const updatedCart = await cartService.addToCart(
                user.id,
                product.id,
                quantity
            );
            setItems(updatedCart.products || []);
        } catch (err: any) {
            if (err.message?.includes("Sesión expirada")) {
                setError("Tu sesión ha expirado. Inicia sesión nuevamente.");
            } else {
                setError("Error al añadir producto al carrito");
            }

            // Revertir cambio optimista cargando desde servidor
            try {
                const cart = await cartService.getCart(user.id);
                setItems(cart.products || []);
            } catch (revertError) {
                console.error(
                    "Error revirtiendo cambio optimista:",
                    revertError
                );
            }
        }
    };

    const removeItem = async (productId: number) => {
        if (!canUseCart) {
            setError("Debes iniciar sesión para modificar el carrito");
            return;
        }

        try {
            setError(null);

            // Actualización optimista
            setItems(items.filter((item) => item.product.id !== productId));

            // Sincronizar con backend
            const updatedCart = await cartService.removeFromCart(
                user.id,
                productId
            );
            setItems(updatedCart.products || []);
        } catch (err: any) {
            setError("Error al eliminar producto del carrito");

            // Revertir cambio
            try {
                const cart = await cartService.getCart(user.id);
                setItems(cart.products || []);
            } catch (revertError) {
                console.error("Error revirtiendo:", revertError);
            }
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (!canUseCart) {
            setError("Debes iniciar sesión para modificar el carrito");
            return;
        }

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
            const updatedCart = await cartService.updateCartQuantity(
                user.id,
                productId,
                quantity
            );
            setItems(updatedCart.products || []);
        } catch (err: any) {
            setError("Error al actualizar cantidad");

            // Revertir cambio
            try {
                const cart = await cartService.getCart(user.id);
                setItems(cart.products || []);
            } catch (revertError) {
                console.error("Error revirtiendo:", revertError);
            }
        }
    };

    const clearCart = async () => {
        if (!canUseCart) {
            setError("Debes iniciar sesión para modificar el carrito");
            return;
        }

        try {
            setError(null);
            console.log(`🛒 ${user.role} limpiando carrito`);

            setItems([]);
            await cartService.clearCart(user.id);

            console.log(`✅ Carrito de ${user.role} limpiado exitosamente`);
        } catch (err: any) {
            console.error("❌ Error limpiando carrito:", err);
            setError("Error al vaciar el carrito");

            // Recargar carrito
            try {
                const cart = await cartService.getCart(user.id);
                setItems(cart.products || []);
            } catch (revertError) {
                console.error("Error recargando carrito:", revertError);
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
        items: canUseCart ? items : [], // Solo mostrar items si está autenticado
        totalItems: canUseCart ? totalItems : 0,
        totalPrice: canUseCart ? totalPrice : 0,
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
