// src/services/productsService.ts
import { createApiClient } from "./api";
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
import { ENDPOINTS } from "../constants";

const apiClient = createApiClient();
const PRODUCTS_ENDPOINT = ENDPOINTS.PRODUCTS;

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
            const product = await apiClient.get<ProductInterface>(
                `${PRODUCTS_ENDPOINT}/${id}`
            );
            cacheProduct(id, product);
            return product;
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

            const url = `${PRODUCTS_ENDPOINT}${
                params.toString() ? "?" + params.toString() : ""
            }`;
            const products = await apiClient.get<ProductInterface[]>(url);

            cacheSearchResults(cacheKey, products);
            return products;
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
