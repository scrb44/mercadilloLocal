import { createApiClient } from "./api";
import { type CartInterface } from "../types/types";
import { productsService } from "./productService";

const apiClient = createApiClient();
let localCartCache: { [userId: string]: CartInterface } = {};

export const cartService = {
    async getCart(userEmail: string): Promise<CartInterface> {
        if (localCartCache[userEmail]) {
            return localCartCache[userEmail];
        }

        try {
            // GET productos del carrito por email (tu backend devuelve lista de productos)
            const productos = await apiClient.get<any[]>(`/api/carrito/${userEmail}`);

            const cart: CartInterface = {
                userId: userEmail,
                // Asumimos cantidad 1 porque backend no maneja cantidad
                products: productos.map(p => ({ product: p, quantity: 1 })),
            };

            localCartCache[userEmail] = cart;
            return cart;
        } catch (error) {
            const emptyCart: CartInterface = { userId: userEmail, products: [] };
            localCartCache[userEmail] = emptyCart;
            return emptyCart;
        }
    },

    async addToCart(userId: string, productId: number): Promise<void> {
        try {
            // POST con body { compradorId, productoId }
            await apiClient.post(`/api/carrito/agregar`, {
                compradorId: userId,
                productoId,
            });
            delete localCartCache[userId]; // limpiar cache para actualizar
        } catch (error) {
            console.warn("No se pudo agregar al carrito:", error);
        }
    },

    async removeFromCart(userId: string, productId: number): Promise<void> {
        try {
            // DELETE con body { compradorId, productoId }
            await apiClient.delete(`/api/carrito/quitar`, {
                data: { compradorId: userId, productoId },
            });
            delete localCartCache[userId];
        } catch (error) {
            console.warn("No se pudo quitar del carrito:", error);
        }
    },

    clearLocalCache(): void {
        localCartCache = {};
    },
};
