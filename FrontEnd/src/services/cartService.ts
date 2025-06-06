// src/services/cartService.ts - ACTUALIZADO CON CONSTANTES Y TIPOS CENTRALIZADOS
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import { type CartInterface } from "../types/types";
import productsService from "./productService"; // Ahora funciona como default import

const apiClient = createApiClient();
let localCartCache: { [userId: string]: CartInterface } = {};

export const cartService = {
    async getCart(userId: string | number): Promise<CartInterface> {
        const cacheKey = userId.toString();
        if (localCartCache[cacheKey]) {
            return localCartCache[cacheKey];
        }

        try {
            const cart = await apiClient.get<CartInterface>(
                `${ENDPOINTS.CART}/${userId}`
            );
            localCartCache[cacheKey] = cart;
            return cart;
        } catch (error: any) {
            // Si no existe carrito o no hay API, crear uno vacío
            const emptyCart: CartInterface = {
                userId,
                products: [],
            };
            localCartCache[cacheKey] = emptyCart;
            return emptyCart;
        }
    },

    async addToCart(
        userId: string | number,
        productId: number,
        quantity: number = 1
    ): Promise<CartInterface> {
        const cart = await this.getCart(userId);
        const product = await productsService.getProduct(productId); // Ahora funciona correctamente

        const existingItemIndex = cart.products.findIndex(
            (item) => item.product.id === productId
        );

        if (existingItemIndex >= 0) {
            cart.products[existingItemIndex].quantity += quantity;
        } else {
            cart.products.push({ product, quantity });
        }

        const cacheKey = userId.toString();
        localCartCache[cacheKey] = {
            ...cart,
            updatedAt: new Date().toISOString(),
        };

        try {
            const updatedCart = await apiClient.post<CartInterface>(
                `${ENDPOINTS.CART}/${userId}/add`,
                { productId, quantity }
            );
            localCartCache[cacheKey] = updatedCart;
            return updatedCart;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para carrito, manteniendo cambios locales"
            );
            return localCartCache[cacheKey];
        }
    },

    async removeFromCart(
        userId: string | number,
        productId: number
    ): Promise<CartInterface> {
        const cart = await this.getCart(userId);

        cart.products = cart.products.filter(
            (item) => item.product.id !== productId
        );

        const cacheKey = userId.toString();
        localCartCache[cacheKey] = {
            ...cart,
            updatedAt: new Date().toISOString(),
        };

        try {
            const updatedCart = await apiClient.delete<CartInterface>(
                `${ENDPOINTS.CART}/${userId}/remove/${productId}`
            );
            localCartCache[cacheKey] = updatedCart;
            return updatedCart;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para carrito, manteniendo cambios locales"
            );
            return localCartCache[cacheKey];
        }
    },

    async updateCartQuantity(
        userId: string | number,
        productId: number,
        quantity: number
    ): Promise<CartInterface> {
        if (quantity <= 0) {
            return this.removeFromCart(userId, productId);
        }

        const cart = await this.getCart(userId);
        const item = cart.products.find(
            (item) => item.product.id === productId
        );
        if (item) {
            item.quantity = quantity;
        }

        const cacheKey = userId.toString();
        localCartCache[cacheKey] = {
            ...cart,
            updatedAt: new Date().toISOString(),
        };

        try {
            const updatedCart = await apiClient.put<CartInterface>(
                `${ENDPOINTS.CART}/${userId}/update`,
                { productId, quantity }
            );
            localCartCache[cacheKey] = updatedCart;
            return updatedCart;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para carrito, manteniendo cambios locales"
            );
            return localCartCache[cacheKey];
        }
    },

    async clearCart(userId: string | number): Promise<void> {
        const cacheKey = userId.toString();
        delete localCartCache[cacheKey];

        try {
            await apiClient.delete(`${ENDPOINTS.CART}/${userId}`);
        } catch (error) {
            console.warn("🔧 API no disponible para limpiar carrito");
        }
    },

    clearLocalCache(): void {
        localCartCache = {};
    },
};
