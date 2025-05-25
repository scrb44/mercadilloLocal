import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    type ReactNode,
} from "react";

import mercadilloService from "../services/mercadilloService";

import {
    type ProductInterface,
    // type CartInterface,
    type CartItemInterface,
    type CartStateInterface,
    type CartAction,
} from "../types/types";

// Context type
interface CartContextType {
    state: CartStateInterface;
    addItem: (product: ProductInterface, quantity?: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    syncWithServer: () => Promise<void>;
    getItemQuantity: (productId: number) => number;
    isInCart: (productId: number) => boolean;
}

// Estado inicial
const initialState: CartStateInterface = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    loading: false,
    error: null,
    syncing: false,
};

// Función para calcular totales
const calculateTotals = (
    items: CartItemInterface[]
): { totalItems: number; totalPrice: number } => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    return { totalItems, totalPrice };
};

// Reducer
const cartReducer = (
    state: CartStateInterface,
    action: CartAction
): CartStateInterface => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_SYNCING":
            return { ...state, syncing: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload };

        case "LOAD_CART_SUCCESS": {
            const { totalItems, totalPrice } = calculateTotals(action.payload);
            return {
                ...state,
                items: action.payload,
                totalItems,
                totalPrice,
                loading: false,
                error: null,
            };
        }

        case "ADD_ITEM_OPTIMISTIC": {
            const existingItemIndex = state.items.findIndex(
                (item) => item.product.id === action.payload.product.id
            );

            let newItems: CartItemInterface[];
            if (existingItemIndex >= 0) {
                newItems = state.items.map((item, index) =>
                    index === existingItemIndex
                        ? {
                              ...item,
                              quantity: item.quantity + action.payload.quantity,
                          }
                        : item
                );
            } else {
                newItems = [
                    ...state.items,
                    {
                        product: action.payload.product,
                        quantity: action.payload.quantity,
                    },
                ];
            }

            const { totalItems, totalPrice } = calculateTotals(newItems);
            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                syncing: true,
            };
        }

        case "REMOVE_ITEM_OPTIMISTIC": {
            const newItems = state.items.filter(
                (item) => item.product.id !== action.payload.productId
            );
            const { totalItems, totalPrice } = calculateTotals(newItems);
            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                syncing: true,
            };
        }

        case "UPDATE_QUANTITY_OPTIMISTIC": {
            let newItems: CartItemInterface[];
            if (action.payload.quantity <= 0) {
                newItems = state.items.filter(
                    (item) => item.product.id !== action.payload.productId
                );
            } else {
                newItems = state.items.map((item) =>
                    item.product.id === action.payload.productId
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                );
            }

            const { totalItems, totalPrice } = calculateTotals(newItems);
            return {
                ...state,
                items: newItems,
                totalItems,
                totalPrice,
                syncing: true,
            };
        }

        case "SYNC_SUCCESS": {
            const { totalItems, totalPrice } = calculateTotals(action.payload);
            return {
                ...state,
                items: action.payload,
                totalItems,
                totalPrice,
                syncing: false,
                error: null,
            };
        }

        case "CLEAR_CART":
            return {
                ...state,
                items: [],
                totalItems: 0,
                totalPrice: 0,
                syncing: false,
            };

        default:
            return state;
    }
};

// Crear el Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider Component
interface CartProviderProps {
    children: ReactNode;
    userId: string | number;
}

export const CartProvider: React.FC<CartProviderProps> = ({
    children,
    userId,
}) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    // Cargar carrito al inicializar o cambiar usuario
    useEffect(() => {
        if (!userId) return;

        const loadCart = async () => {
            try {
                dispatch({ type: "SET_LOADING", payload: true });
                const cart = await mercadilloService.getCart(userId);
                dispatch({ type: "LOAD_CART_SUCCESS", payload: cart.products });
            } catch (error) {
                console.error("Error loading cart:", error);
                dispatch({
                    type: "SET_ERROR",
                    payload: "Error al cargar el carrito",
                });
                dispatch({ type: "SET_LOADING", payload: false });
            }
        };

        loadCart();
    }, [userId]);

    // Funciones del contexto
    const addItem = async (product: ProductInterface, quantity: number = 1) => {
        if (!userId) {
            dispatch({
                type: "SET_ERROR",
                payload: "Debes estar logueado para añadir productos",
            });
            return;
        }

        try {
            // Actualización optimista (UX inmediata)
            dispatch({
                type: "ADD_ITEM_OPTIMISTIC",
                payload: { product, quantity },
            });

            // Sincronizar con servidor
            const updatedCart = await mercadilloService.addToCart(
                userId,
                product.id,
                quantity
            );
            dispatch({ type: "SYNC_SUCCESS", payload: updatedCart.products });
        } catch (error) {
            console.error("Error adding item to cart:", error);
            dispatch({
                type: "SET_ERROR",
                payload: "Error al añadir producto al carrito",
            });

            // Revertir cambio optimista cargando desde servidor
            try {
                const cart = await mercadilloService.getCart(userId);
                dispatch({ type: "SYNC_SUCCESS", payload: cart.products });
            } catch (revertError) {
                console.error(
                    "Error reverting optimistic update:",
                    revertError
                );
            }
        }
    };

    const removeItem = async (productId: number) => {
        if (!userId) return;

        try {
            // Actualización optimista
            dispatch({
                type: "REMOVE_ITEM_OPTIMISTIC",
                payload: { productId },
            });

            // Sincronizar con servidor
            const updatedCart = await mercadilloService.removeFromCart(
                userId,
                productId
            );
            dispatch({ type: "SYNC_SUCCESS", payload: updatedCart.products });
        } catch (error) {
            console.error("Error removing item from cart:", error);
            dispatch({
                type: "SET_ERROR",
                payload: "Error al eliminar producto del carrito",
            });

            // Revertir cambio optimista
            try {
                const cart = await mercadilloService.getCart(userId);
                dispatch({ type: "SYNC_SUCCESS", payload: cart.products });
            } catch (revertError) {
                console.error(
                    "Error reverting optimistic update:",
                    revertError
                );
            }
        }
    };

    const updateQuantity = async (productId: number, quantity: number) => {
        if (!userId) return;

        try {
            // Actualización optimista
            dispatch({
                type: "UPDATE_QUANTITY_OPTIMISTIC",
                payload: { productId, quantity },
            });

            // Sincronizar con servidor
            const updatedCart = await mercadilloService.updateCartQuantity(
                userId,
                productId,
                quantity
            );
            dispatch({ type: "SYNC_SUCCESS", payload: updatedCart.products });
        } catch (error) {
            console.error("Error updating cart quantity:", error);
            dispatch({
                type: "SET_ERROR",
                payload: "Error al actualizar cantidad",
            });

            // Revertir cambio optimista
            try {
                const cart = await mercadilloService.getCart(userId);
                dispatch({ type: "SYNC_SUCCESS", payload: cart.products });
            } catch (revertError) {
                console.error(
                    "Error reverting optimistic update:",
                    revertError
                );
            }
        }
    };

    const clearCart = async () => {
        if (!userId) return;

        try {
            dispatch({ type: "CLEAR_CART" });
            await mercadilloService.clearCart(userId);
        } catch (error) {
            console.error("Error clearing cart:", error);
            dispatch({
                type: "SET_ERROR",
                payload: "Error al vaciar el carrito",
            });

            // Recargar carrito desde servidor
            try {
                const cart = await mercadilloService.getCart(userId);
                dispatch({ type: "LOAD_CART_SUCCESS", payload: cart.products });
            } catch (revertError) {
                console.error("Error reloading cart:", revertError);
            }
        }
    };

    const syncWithServer = async () => {
        if (!userId) return;

        try {
            dispatch({ type: "SET_SYNCING", payload: true });
            const cart = await mercadilloService.syncCartWithServer(userId);
            dispatch({ type: "SYNC_SUCCESS", payload: cart.products });
        } catch (error) {
            console.error("Error syncing with server:", error);
            dispatch({
                type: "SET_ERROR",
                payload: "Error al sincronizar con el servidor",
            });
            dispatch({ type: "SET_SYNCING", payload: false });
        }
    };

    const getItemQuantity = (productId: number): number => {
        const item = state.items.find((item) => item.product.id === productId);
        return item ? item.quantity : 0;
    };

    const isInCart = (productId: number): boolean => {
        return state.items.some((item) => item.product.id === productId);
    };

    const contextValue: CartContextType = {
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        syncWithServer,
        getItemQuantity,
        isInCart,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default CartContext;
