// src/services/productService.ts - PRIORIZA API REAL - CORREGIDO
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import {
    cacheProduct,
    getCachedProduct,
    cacheSearchResults,
    getCachedSearchResults,
} from "./cache";
import { MOCK_PRODUCTS } from "./mockData";
import {
    type ProductInterface,
    type SearchFiltersInterface,
} from "../types/types";
import { type ApiProduct } from "../types/apiTypes";
import {
    adaptApiProduct,
    adaptApiProducts,
    adaptValidApiProducts,
} from "../adapters";

const apiClient = createApiClient();

export const productsService = {
    async getProduct(
        id: number,
        useCache: boolean = true
    ): Promise<ProductInterface> {
        if (useCache) {
            const cached = getCachedProduct<ProductInterface>(id);
            if (cached) return cached;
        }

        try {
            // SIEMPRE intentar API real primero
            const apiProduct = await apiClient.get<ApiProduct>(
                `${ENDPOINTS.PRODUCTS}/${id}`
            );

            const adaptedProduct = adaptApiProduct(apiProduct);
            cacheProduct(id, adaptedProduct);
            return adaptedProduct;
        } catch (error: any) {
            console.warn(`🔧 API falló para producto ${id}:`, error.message);

            // SOLO usar mock si la API definitivamente no está disponible
            // Y SOLO para IDs que realmente existen en el mock
            if (error.status === 404) {
                // Si el producto no existe en la API, buscar en mock
                const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
                if (mockProduct) {
                    console.log(`📦 Usando producto mock para ID ${id}`);
                    return mockProduct;
                }
            } else if (error.message?.includes("fetch")) {
                // Si hay problema de red, usar mock temporalmente
                const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
                if (mockProduct) {
                    console.log(
                        `🌐 API no disponible, usando mock para ID ${id}`
                    );
                    return mockProduct;
                }
            }

            throw new Error(
                `Producto con ID ${id} no encontrado en API ni en datos locales`
            );
        }
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
        // Corregido: usar productsService.getProducts en lugar de this.getProducts
        return productsService.getProducts({ query }, useCache);
    },
};

// Exportar también como default para compatibilidad
export default productsService;
