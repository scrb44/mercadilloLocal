// src/services/productService.ts - PRIORIZA API REAL - CORREGIDO
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import {
    cacheProduct,
    getCachedProduct,
    cacheSearchResults,
    getCachedSearchResults,
    removeItem,
} from "./cache";
import { MOCK_PRODUCTS } from "./mockData";
import {
    type ProductInterface,
    type SearchFiltersInterface,
} from "../types/types";
import { type ApiProduct } from "../types/apiTypes";
import { adaptApiProduct, adaptValidApiProducts } from "../adapters";

const apiClient = createApiClient();

// 🔧 Funciones helper para cache (usando las funciones existentes)
const invalidateProductCache = (productId: number): void => {
    const cacheKey = `mercadillo-product-${productId}`;
    removeItem(cacheKey);
};

const isProductCacheStale = (
    productId: number,
    maxAge: number = 1000 * 60 * 15
): boolean => {
    const cacheKey = `mercadillo-product-${productId}`;
    const cachedItem = localStorage.getItem(cacheKey);

    if (!cachedItem) return true;

    try {
        const parsed = JSON.parse(cachedItem);
        const age = Date.now() - parsed.timestamp;
        return age > maxAge;
    } catch {
        return true;
    }
};

const cacheProductWithTimestamp = (
    productId: number,
    data: ProductInterface
): void => {
    cacheProduct(productId, data); // Usar función existente
};

export const productsService = {
    async getProduct(
        id: number,
        useCache: boolean = true,
        forceRefresh: boolean = false
    ): Promise<ProductInterface> {
        // 🔧 Si se fuerza refresh, invalidar cache primero
        if (forceRefresh) {
            invalidateProductCache(id);
        }

        // 🔧 Verificar cache solo si useCache es true y no se fuerza refresh
        if (useCache && !forceRefresh) {
            const cached = getCachedProduct<ProductInterface>(id);
            if (cached && !isProductCacheStale(id)) {
                return cached;
            } else if (cached) {
                invalidateProductCache(id);
            }
        }

        try {
            // SIEMPRE intentar API real primero
            const apiProduct = await apiClient.get<ApiProduct>(
                `${ENDPOINTS.PRODUCTS}/${id}`
            );

            const adaptedProduct = adaptApiProduct(apiProduct);

            // 🔧 Guardar en cache solo si no se forzó refresh
            if (!forceRefresh) {
                cacheProductWithTimestamp(id, adaptedProduct);
            }

            return adaptedProduct;
        } catch (error: any) {
            console.warn(`🔧 API falló para producto ${id}:`, error.message);

            // SOLO usar mock si la API definitivamente no está disponible
            if (error.status === 404) {
                const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
                if (mockProduct) {
                    return mockProduct;
                }
            } else if (error.message?.includes("fetch")) {
                const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
                if (mockProduct) {
                    return mockProduct;
                }
            }

            throw new Error(
                `Producto con ID ${id} no encontrado en API ni en datos locales`
            );
        }
    },

    // 🔧 Nuevo método específico para editing que siempre trae datos frescos
    async getProductForEditing(id: number): Promise<ProductInterface> {
        return productsService.getProduct(id, false, true); // 🔧 Usar productsService en lugar de this
    },

    async getProducts(
        filters?: SearchFiltersInterface,
        useCache: boolean = true
    ): Promise<ProductInterface[]> {
        try {
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

            const url = `${ENDPOINTS.PRODUCTS}${
                params.toString() ? "?" + params.toString() : ""
            }`;

            // PRIORIZAR API real
            const apiProducts = await apiClient.get<ApiProduct[]>(url);
            const adaptedProducts = adaptValidApiProducts(apiProducts);

            cacheSearchResults(cacheKey, adaptedProducts);
            return adaptedProducts;
        } catch (error: any) {
            console.warn(
                "🔧 API de productos no disponible, usando datos de ejemplo"
            );

            let filteredProducts = MOCK_PRODUCTS;

            // Filtrar por búsqueda si hay query
            if (filters?.query) {
                const query = filters.query.toLowerCase();
                filteredProducts = filteredProducts.filter(
                    (p) =>
                        p.name.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query)
                );
            }

            // Filtrar por categoría si se especifica
            if (filters?.category) {
                filteredProducts = filteredProducts.filter((product) =>
                    product.categories.some(
                        (cat) => cat.id === filters.category
                    )
                );
            }

            return filteredProducts;
        }
    },

    async searchProducts(
        query: string,
        useCache: boolean = true
    ): Promise<ProductInterface[]> {
        // Usar productsService.getProducts en lugar de this.getProducts
        return productsService.getProducts({ query }, useCache);
    },
};

// Exportar también como default para compatibilidad
export default productsService;
