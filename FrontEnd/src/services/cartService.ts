// src/services/cartService.ts
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import { type CartInterface } from "../types/types";

const apiClient = createApiClient();
let localCartCache: { [email: string]: CartInterface } = {};

export const cartService = {
    async getCart(email: string): Promise<CartInterface> {
        if (localCartCache[email]) {
            return localCartCache[email];
        }

        try {
            const productos = await apiClient.get<any[]>(
                `${ENDPOINTS.CART}/${email}`
            );
            const cart: CartInterface = {
                userId: email,
                products: productos.map((producto) => ({
                    product: producto,
                    quantity: 1, // Asumimos 1 si el backend no manda cantidades
                })),
            };
            localCartCache[email] = cart;
            return cart;
        } catch (error) {
            const emptyCart: CartInterface = {
                userId: email,
                products: [],
            };
            localCartCache[email] = emptyCart;
            return emptyCart;
        }
    },

    async addToCart(compradorId: number, productoId: number): Promise<void> {
        const payload = { compradorId, productoId };
        try {
            await apiClient.post(ENDPOINTS.CART_ADD, payload);
            this.clearLocalCache(); // Limpiar para forzar refetch
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    },

    async removeFromCart(compradorId: number, productoId: number): Promise<void> {
        const payload = { compradorId, productoId };
        try {
            await apiClient.delete(ENDPOINTS.CART_REMOVE, payload);
            this.clearLocalCache();
        } catch (error) {
            console.error("Error al quitar producto del carrito:", error);
            throw error;
        }
    },

    clearLocalCache(): void {
        localCartCache = {};
    },
};
