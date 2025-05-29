// src/services/cartService.ts
import { createApiClient } from "./api";
import { type CartInterface } from "../types/types";
import { productsService } from "./productService";

const apiClient = createApiClient();
let localCartCache: { [userId: string]: CartInterface } = {};

export const cartService = {
    async getCart(userId: string | number): Promise<CartInterface> {
        const cacheKey = userId.toString();
        if (localCartCache[cacheKey]) {
            return localCartCache[cacheKey];
        }

        try {
            const cart = await apiClient.get<CartInterface>(`cart/${userId}`);
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
        const product = await productsService.getProduct(productId);

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
                `cart/${userId}/add`,
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
                `cart/${userId}/remove/${productId}`
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
                `cart/${userId}/update`,
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
            await apiClient.delete(`cart/${userId}`);
        } catch (error) {
            console.warn("🔧 API no disponible para limpiar carrito");
        }
    },

    clearLocalCache(): void {
        localCartCache = {};
    },
};
