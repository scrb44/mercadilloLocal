// src/adapters/cartAdapter.ts - Adaptador para carrito

import { type CartInterface, type CartItemInterface } from "../types/types";
import { type ApiCart, type ApiCartItem } from "../types/apiTypes";

/**
 * Convierte un carrito de la API al formato que usa el frontend
 */
export function adaptApiCart(apiCart: ApiCart): CartInterface {
    return {
        id: apiCart.id,
        userId: apiCart.usuarioId,
        products: adaptApiCartItems(apiCart.productos),
        // updatedAt: apiCart.fechaActualizacion, // Descomentar cuando la API lo incluya
    };
}

/**
 * Convierte items del carrito de la API al formato del frontend
 */
export function adaptApiCartItems(
    apiCartItems: ApiCartItem[]
): CartItemInterface[] {
    // NOTA: Esta función asume que necesitarás obtener los productos por separado
    // ya que la API del carrito probablemente solo devuelve IDs de productos

    return apiCartItems.map((apiItem) => ({
        // Tendrás que cargar el producto completo usando el adaptador de productos
        product: {
            id: apiItem.productoId,
            name: "Cargando...", // Placeholder hasta cargar el producto completo
            description: "",
            price: 0,
            img: ["/placeholder-image.jpg"],
            video: [],
            vendedor: { id: 0, name: "Cargando...", img: "" },
            categories: [],
        },
        quantity: apiItem.cantidad,
    }));
}

/**
 * Convierte un carrito del frontend al formato de la API (para POST/PUT)
 */
export function adaptCartToApi(cart: CartInterface): Partial<ApiCart> {
    return {
        usuarioId: cart.userId,
        productos: cart.products.map((item) => ({
            productoId: item.product.id,
            cantidad: item.quantity,
        })),
    };
}

/**
 * Convierte un item del carrito del frontend al formato de la API
 */
export function adaptCartItemToApi(item: CartItemInterface): ApiCartItem {
    return {
        productoId: item.product.id,
        cantidad: item.quantity,
    };
}

// ============ FUNCIONES DE VALIDACIÓN ============

/**
 * Valida que un carrito de la API tenga los campos mínimos necesarios
 */
export function validateApiCart(apiCart: any): apiCart is ApiCart {
    return (
        typeof apiCart === "object" &&
        apiCart.usuarioId !== undefined &&
        Array.isArray(apiCart.productos)
    );
}

/**
 * Valida que un item del carrito de la API sea válido
 */
export function validateApiCartItem(
    apiCartItem: any
): apiCartItem is ApiCartItem {
    return (
        typeof apiCartItem === "object" &&
        typeof apiCartItem.productoId === "number" &&
        typeof apiCartItem.cantidad === "number" &&
        apiCartItem.cantidad > 0
    );
}

// ============ FUNCIONES AUXILIARES ============

/**
 * Crea un carrito vacío con la estructura correcta
 */
export function createEmptyCart(userId: string | number): CartInterface {
    return {
        userId,
        products: [],
        updatedAt: new Date().toISOString(),
    };
}

/**
 * Calcula totales del carrito
 */
export function calculateCartTotals(cart: CartInterface) {
    const totalItems = cart.products.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    const totalPrice = cart.products.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return { totalItems, totalPrice };
}
