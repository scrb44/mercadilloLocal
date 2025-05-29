// src/services/productService.ts - ACTUALIZADO CON ADAPTADORES
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
import { adaptApiProduct, adaptValidApiProducts } from "../adapters";

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
            // La API devuelve ApiProduct, lo adaptamos a ProductInterface
            const apiProduct = await apiClient.get<ApiProduct>(
                `${ENDPOINTS.PRODUCTS}/${id}`
            );

            const adaptedProduct = adaptApiProduct(apiProduct);
            cacheProduct(id, adaptedProduct);
            return adaptedProduct;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para producto, usando datos de ejemplo"
            );
            const mockProduct = MOCK_PRODUCTS.find((p) => p.id === id);
            if (mockProduct) {
                return mockProduct;
            }
            throw new Error(`Producto con ID ${id} no encontrado`);
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

            // La API devuelve ApiProduct[], lo adaptamos a ProductInterface[]
            const apiProducts = await apiClient.get<ApiProduct[]>(url);
            const adaptedProducts = adaptValidApiProducts(apiProducts);

            cacheSearchResults(cacheKey, adaptedProducts);
            return adaptedProducts;
        } catch (error) {
            console.warn("🔧 API no disponible, usando datos de ejemplo");

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

            return filteredProducts;
        }
    },

    async searchProducts(
        query: string,
        useCache: boolean = true
    ): Promise<ProductInterface[]> {
        return this.getProducts({ query }, useCache);
    },
};
