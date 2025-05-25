import {
    // get, post, put, deleteRequest,
    createApiClient,
} from "./api";
import {
    cacheProduct,
    getCachedProduct,
    cacheCategory,
    getCachedCategory,
    cacheVendor,
    getCachedVendor,
    cacheSearchResults,
    getCachedSearchResults,
} from "./cache";

import {
    type VendedorInterface,
    type CategoryInterface,
    type ProductInterface,
    // type CartItemInterface,
    type CartInterface,
    type SearchFiltersInterface,
} from "../types/types";

export function createMercadilloService() {
    const apiClient = createApiClient();

    // Cache local del carrito para performance
    let localCartCache: { [userId: string]: CartInterface } = {};

    return {
        // ============ PRODUCTOS ============
        async getProduct(
            id: number,
            useCache: boolean = true
        ): Promise<ProductInterface> {
            if (useCache) {
                const cached = getCachedProduct<ProductInterface>(id);
                if (cached) return cached;
            }

            const product = await apiClient.get<ProductInterface>(
                `products/${id}`
            );
            cacheProduct(id, product);
            return product;
        },

        async getProducts(
            filters?: SearchFiltersInterface,
            useCache: boolean = true
        ): Promise<ProductInterface[]> {
            const cacheKey = JSON.stringify(filters || {});

            if (useCache) {
                const cached =
                    getCachedSearchResults<ProductInterface[]>(cacheKey);
                if (cached) return cached;
            }

            const params = new URLSearchParams();
            if (filters?.category)
                params.append("category", filters.category.toString());
            if (filters?.vendor)
                params.append("vendor", filters.vendor.toString());
            if (filters?.minPrice)
                params.append("minPrice", filters.minPrice.toString());
            if (filters?.maxPrice)
                params.append("maxPrice", filters.maxPrice.toString());
            if (filters?.query) params.append("q", filters.query);

            const url = `products${
                params.toString() ? "?" + params.toString() : ""
            }`;
            const products = await apiClient.get<ProductInterface[]>(url);

            cacheSearchResults(cacheKey, products);
            return products;
        },

        async searchProducts(
            query: string,
            useCache: boolean = true
        ): Promise<ProductInterface[]> {
            return this.getProducts({ query }, useCache);
        },

        // ============ CATEGORÍAS ============
        async getCategory(
            id: number,
            useCache: boolean = true
        ): Promise<CategoryInterface> {
            if (useCache) {
                const cached = getCachedCategory<CategoryInterface>(id);
                if (cached) return cached;
            }

            const category = await apiClient.get<CategoryInterface>(
                `categories/${id}`
            );
            cacheCategory(id, category);
            return category;
        },

        async getCategories(
            useCache: boolean = true
        ): Promise<CategoryInterface[]> {
            const cacheKey = "all-categories";

            if (useCache) {
                const cached =
                    getCachedSearchResults<CategoryInterface[]>(cacheKey);
                if (cached) return cached;
            }

            const categories = await apiClient.get<CategoryInterface[]>(
                "categories"
            );
            cacheSearchResults(cacheKey, categories);
            return categories;
        },

        async getCategoryTree(
            parentId?: number,
            useCache: boolean = true
        ): Promise<CategoryInterface[]> {
            const cacheKey = `category-tree-${parentId || "root"}`;

            if (useCache) {
                const cached =
                    getCachedSearchResults<CategoryInterface[]>(cacheKey);
                if (cached) return cached;
            }

            const url = parentId
                ? `categories?parent=${parentId}`
                : "categories?parent=null";
            const categories = await apiClient.get<CategoryInterface[]>(url);
            cacheSearchResults(cacheKey, categories);
            return categories;
        },

        // ============ VENDEDORES ============
        async getVendor(
            id: number,
            useCache: boolean = true
        ): Promise<VendedorInterface> {
            if (useCache) {
                const cached = getCachedVendor<VendedorInterface>(id);
                if (cached) return cached;
            }

            const vendor = await apiClient.get<VendedorInterface>(
                `vendors/${id}`
            );
            cacheVendor(id, vendor);
            return vendor;
        },

        async getVendors(
            useCache: boolean = true
        ): Promise<VendedorInterface[]> {
            const cacheKey = "all-vendors";

            if (useCache) {
                const cached =
                    getCachedSearchResults<VendedorInterface[]>(cacheKey);
                if (cached) return cached;
            }

            const vendors = await apiClient.get<VendedorInterface[]>("vendors");
            cacheSearchResults(cacheKey, vendors);
            return vendors;
        },

        async getProductsByVendor(
            vendorId: number,
            useCache: boolean = true
        ): Promise<ProductInterface[]> {
            return this.getProducts({ vendor: vendorId }, useCache);
        },

        // ============ CARRITO (CON BASE DE DATOS) ============
        async getCart(userId: string | number): Promise<CartInterface> {
            const cacheKey = userId.toString();
            if (localCartCache[cacheKey]) {
                return localCartCache[cacheKey];
            }

            try {
                const cart = await apiClient.get<CartInterface>(
                    `cart/${userId}`
                );

                localCartCache[cacheKey] = cart;
                return cart;
            } catch (error: any) {
                if (error.status === 404) {
                    const emptyCart: CartInterface = {
                        userId,
                        products: [],
                    };

                    localCartCache[cacheKey] = emptyCart;
                    return emptyCart;
                }
                throw error;
            }
        },

        async addToCart(
            userId: string | number,
            productId: number,
            quantity: number = 1
        ): Promise<CartInterface> {
            const cart = await this.getCart(userId);
            const product = await this.getProduct(productId);

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
                    {
                        productId,
                        quantity,
                    }
                );

                localCartCache[cacheKey] = updatedCart;
                return updatedCart;
            } catch (error) {
                console.error("Error syncing cart with database:", error);
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
                // ← FIX: Ahora funciona correctamente
                const updatedCart = await apiClient.delete<CartInterface>(
                    `cart/${userId}/remove/${productId}`
                );

                localCartCache[cacheKey] = updatedCart;
                return updatedCart;
            } catch (error) {
                console.error(
                    "Error syncing cart removal with database:",
                    error
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
                    {
                        productId,
                        quantity,
                    }
                );

                localCartCache[cacheKey] = updatedCart;
                return updatedCart;
            } catch (error) {
                console.error(
                    "Error syncing cart quantity with database:",
                    error
                );
                return localCartCache[cacheKey];
            }
        },

        async clearCart(userId: string | number): Promise<void> {
            const cacheKey = userId.toString();
            delete localCartCache[cacheKey];

            try {
                // ← FIX: Ahora funciona correctamente
                await apiClient.delete(`cart/${userId}`);
            } catch (error) {
                console.error("Error clearing cart in database:", error);
                throw error;
            }
        },

        async syncCartWithServer(
            userId: string | number
        ): Promise<CartInterface> {
            try {
                const serverCart = await apiClient.get<CartInterface>(
                    `cart/${userId}`
                );

                const cacheKey = userId.toString();
                localCartCache[cacheKey] = serverCart;

                return serverCart;
            } catch (error: any) {
                if (error.status === 404) {
                    const emptyCart: CartInterface = {
                        userId,
                        products: [],
                    };
                    return emptyCart;
                }
                throw error;
            }
        },

        // ============ UTILIDADES ============
        cancelRequests(): void {
            apiClient.abort();
        },

        clearLocalCache(): void {
            localCartCache = {};
        },

        getLocalCacheStatus(userId: string | number): boolean {
            const cacheKey = userId.toString();
            return !!localCartCache[cacheKey];
        },
    };
}

// Exportar una instancia por defecto
export const mercadilloService = createMercadilloService();

// Tipo automático
export type MercadilloService = ReturnType<typeof createMercadilloService>;

export default mercadilloService;
