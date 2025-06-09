// src/adapters/cartAdapter.ts - Adaptador para carrito

import { type CartInterface, type CartItemInterface } from "../types/types";
import { type ApiCart, type ApiCartItem } from "../types/apiTypes";
import { PlaceholderURL } from "../constants";

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
        // 🔧 PRODUCTO con estructura completa según ProductInterface
        product: {
            id: apiItem.productoId,
            name: "Cargando...", // Placeholder hasta cargar el producto completo
            description: "",
            price: 0,
            img: [PlaceholderURL],
            video: [], // Propiedad opcional pero definida
            categories: [], // Array vacío en lugar de never[]

            // 🔧 VENDEDOR con estructura completa según VendedorInterface
            vendedor: {
                id: 0,
                name: "Cargando...",
                img: "",
                nombre: "Cargando...", // Propiedad requerida
                imagen: "", // Propiedad requerida
                email: undefined,
                usuario: undefined,
                verificado: undefined,
                localidad: undefined,
                telf: undefined,
            },

            // 🔧 MUNICIPALITY con estructura correcta según Localidad
            municipality: {
                id: 0,
                nombre: "Cargando...",
                provincia: "Cargando...",
            },
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

// ============ FUNCIÓN HELPER PARA CREAR PRODUCTO PLACEHOLDER ============

/**
 * Crea un producto placeholder con la estructura completa de ProductInterface
 * Útil para cuando solo tenemos el ID del producto del carrito
 */
export function createProductPlaceholder(productId: number) {
    return {
        id: productId,
        name: "Cargando producto...",
        description: "Obteniendo información del producto...",
        price: 0,
        img: [PlaceholderURL],
        video: [],
        categories: [],
        vendedor: {
            id: 0,
            name: "Cargando vendedor...",
            img: "",
            nombre: "Cargando vendedor...",
            imagen: "",
            email: undefined,
            usuario: undefined,
            verificado: undefined,
            localidad: undefined,
            telf: undefined,
        },
        municipality: {
            id: 0,
            nombre: "Cargando localidad...",
            provincia: "Cargando provincia...",
        },
    };
}
