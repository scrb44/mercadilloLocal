// src/adapters/cartResponseAdapter.ts - Adaptador específico para respuestas del CarritoController

import { type CartInterface, type CartItemInterface } from "../types/types";
import { adaptApiProduct } from "./productAdapter";

/**
 * Tipo de respuesta que devuelve el CarritoController según el código Java ACTUALIZADO
 */
interface CarritoResponse {
    userId: number;
    products: any[]; // Array de productos únicos del backend
    quantities: { [productId: string]: number }; // Mapa de cantidades por producto
    updatedAt: string;
}

/**
 * Adapta la respuesta específica del CarritoController a nuestro CartInterface
 */
export function adaptCarritoResponse(response: CarritoResponse): CartInterface {
    return {
        userId: response.userId,
        products: response.products.map((product) => {
            // Cada producto del carrito es un producto completo
            const adaptedProduct = adaptApiProduct(product);

            // 🔧 NUEVO: Obtener cantidad real desde el mapa de quantities
            const quantity = response.quantities[product.id.toString()] || 1;

            const cartItem: CartItemInterface = {
                product: adaptedProduct,
                quantity: quantity, // ✅ Cantidad real desde el backend
            };

            return cartItem;
        }),
        updatedAt: response.updatedAt || new Date().toISOString(),
    };
}

/**
 * Consolida productos duplicados y suma sus cantidades
 * El backend puede devolver el mismo producto multiple veces
 * En lugar de [producto1, producto1, producto2], queremos [producto1(x2), producto2(x1)]
 */
export function consolidateCartItems(
    items: CartItemInterface[]
): CartItemInterface[] {
    const consolidatedMap = new Map<number, CartItemInterface>();

    items.forEach((item) => {
        const productId = item.product.id;

        if (consolidatedMap.has(productId)) {
            const existing = consolidatedMap.get(productId)!;
            existing.quantity += item.quantity;
        } else {
            consolidatedMap.set(productId, { ...item });
        }
    });

    return Array.from(consolidatedMap.values());
}

/**
 * Adapta respuesta completa del carrito (ya no necesita consolidación)
 */
export function adaptAndConsolidateCartResponse(
    response: CarritoResponse
): CartInterface {
    // ✅ Ya no necesitamos consolidar porque el backend lo hace
    return adaptCarritoResponse(response);
}

/**
 * Calcula totales del carrito (cantidad total y precio total)
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

/**
 * Busca un producto específico en el carrito
 */
export function findCartItem(
    cart: CartInterface,
    productId: number
): CartItemInterface | null {
    return cart.products.find((item) => item.product.id === productId) || null;
}

/**
 * Verifica si un producto está en el carrito
 */
export function isProductInCart(
    cart: CartInterface,
    productId: number
): boolean {
    return cart.products.some((item) => item.product.id === productId);
}

/**
 * Obtiene la cantidad de un producto específico en el carrito
 */
export function getProductQuantityInCart(
    cart: CartInterface,
    productId: number
): number {
    const item = findCartItem(cart, productId);
    return item ? item.quantity : 0;
}
