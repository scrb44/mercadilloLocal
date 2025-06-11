// src/services/productService.ts - ACTUALIZADO para incluir localidad

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
import {
    adaptApiProduct,
    adaptValidApiProducts,
    type ApiProduct,
} from "../adapters";

const apiClient = createApiClient();

// 🔧 Funciones helper para cache usando las funciones existentes
const invalidateProductCache = (productId: number): void => {
    removeItem(`mercadillo-product-${productId}`);
};

const isProductCacheStale = (
    productId: number,
    maxAge: number = 1000 * 60 * 15
): boolean => {
    const cached = getCachedProduct<ProductInterface>(productId);
    if (!cached) return true;
    // Si existe en cache y no ha expirado, no está stale
    return false;
};

export interface SearchFiltersWithLocalidad extends SearchFiltersInterface {
    localidad?: number; // Agregar filtro de localidad
}

export const productsService = {
    async getProduct(id: number): Promise<ProductInterface> {
        try {
            // Obtener desde API
            const apiProduct = await apiClient.get<ApiProduct>(
                `${ENDPOINTS.PRODUCTS}/${id}`
            );

            const adaptedProduct = adaptApiProduct(apiProduct);

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
        return productsService.getProduct(id);
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
                if (cached) {
                    return cached;
                }
            }

            // 🔧 ACTUALIZADO: Construir parámetros incluyendo los nuevos filtros
            const params = new URLSearchParams();

            if (filters?.category) {
                params.append("categoria", filters.category.toString());
            }

            if (filters?.vendor) {
                params.append("vendedor", filters.vendor.toString());
            }

            if (filters?.minPrice) {
                params.append("minPrice", filters.minPrice.toString());
            }

            if (filters?.maxPrice) {
                params.append("maxPrice", filters.maxPrice.toString());
            }

            if (filters?.query) {
                params.append("busqueda", filters.query);
            }

            // 🔧 NUEVO: Parámetro de localidad automático
            if (filters?.localidad) {
                params.append("localidad", filters.localidad.toString());
            }

            // 🔧 NOTA: vendorName no se envía al backend (no lo soporta aún)
            // Se manejará en el filtrado local del fallback

            const url = `${ENDPOINTS.PRODUCTS}${
                params.toString() ? "?" + params.toString() : ""
            }`;

            // PRIORIZAR API real
            let apiProducts = await apiClient.get<ApiProduct[]>(url);
            let adaptedProducts = adaptValidApiProducts(apiProducts);

            // 🔧 NUEVO: Aplicar filtro de vendorName localmente si es necesario
            if (filters?.vendorName && filters.vendorName.trim()) {
                const vendorQuery = filters.vendorName.toLowerCase();

                adaptedProducts = adaptedProducts.filter((product) => {
                    const vendorName =
                        product.vendedor?.name?.toLowerCase() ||
                        product.vendedor?.nombre?.toLowerCase() ||
                        "";
                    const matches = vendorName.includes(vendorQuery);
                    return matches;
                });
            }

            cacheSearchResults(cacheKey, adaptedProducts);
            return adaptedProducts;
        } catch (error: any) {
            console.warn(
                "🔧 API de productos no disponible, usando datos de ejemplo"
            );
            console.warn("Error:", error.message);

            let filteredProducts = [...MOCK_PRODUCTS]; // Clonar array

            // Filtrar por categoría primero
            if (filters?.category) {
                filteredProducts = filteredProducts.filter((product) => {
                    const hasCategory = product.categories.some(
                        (cat) => cat.id === filters.category
                    );
                    return hasCategory;
                });
            }

            // Filtrar por búsqueda si hay query
            if (filters?.query && filters.query.trim()) {
                const query = filters.query.toLowerCase();
                filteredProducts = filteredProducts.filter(
                    (p) =>
                        p.name.toLowerCase().includes(query) ||
                        p.description.toLowerCase().includes(query)
                );
            }

            // Filtrar por vendor ID si se especifica
            if (filters?.vendor) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.vendedor?.id === filters.vendor
                );
            }

            // 🔧 MEJORADO: Filtrar por nombre de vendedor
            if (filters?.vendorName && filters.vendorName.trim()) {
                const vendorQuery = filters.vendorName.toLowerCase();

                filteredProducts = filteredProducts.filter((product) => {
                    const vendorName =
                        product.vendedor?.name?.toLowerCase() ||
                        product.vendedor?.nombre?.toLowerCase() ||
                        "";
                    const matches = vendorName.includes(vendorQuery);

                    return matches;
                });
            }

            // Filtrar por precio mínimo
            if (filters?.minPrice) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.price >= filters.minPrice!
                );
            }

            // Filtrar por precio máximo
            if (filters?.maxPrice) {
                filteredProducts = filteredProducts.filter(
                    (product) => product.price <= filters.maxPrice!
                );
            }

            // 🔧 NUEVO: Filtrar por localidad (usando datos mock)
            if (filters?.localidad) {
                filteredProducts = filteredProducts.filter((product) => {
                    // Verificar si el producto tiene municipio
                    if (product.municipality?.id === filters.localidad) {
                        return true;
                    }
                    // Fallback: verificar localidad del vendedor (si es string)
                    if (typeof product.vendedor?.localidad === "string") {
                        return product.vendedor.localidad.includes(
                            filters.localidad!.toString()
                        );
                    }
                    // Fallback: verificar ID de localidad del vendedor
                    if (typeof product.vendedor?.localidad === "number") {
                        return product.vendedor.localidad === filters.localidad;
                    }
                    return false;
                });
            }

            return filteredProducts;
        }
    },
    async searchProducts(
        query: string,
        localidad?: number,
        useCache: boolean = true
    ): Promise<ProductInterface[]> {
        return productsService.getProducts({ query, localidad }, useCache);
    },

    // ✅ NUEVO: Método específico para obtener productos por localidad
    async getProductsByLocalidad(
        localidadId: number,
        additionalFilters?: Omit<SearchFiltersWithLocalidad, "localidad">,
        useCache: boolean = true
    ): Promise<ProductInterface[]> {
        const filters: SearchFiltersWithLocalidad = {
            ...additionalFilters,
            localidad: localidadId,
        };

        return productsService.getProducts(filters, useCache);
    },
};

// Exportar también como default para compatibilidad
export default productsService;
