// src/services/categoryService.ts - PRIORIZA API REAL
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import {
    cacheCategory,
    getCachedCategory,
    cacheSearchResults,
    getCachedSearchResults,
} from "./cache";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "./mockData";
import { type CategoryInterface } from "../types/types";
import { type ApiCategory } from "../types/apiTypes";
import {
    adaptApiCategory,
    flattenCategories,
    organizeHierarchicalCategories,
    validateApiCategory,
    extractProductsFromCategory,
} from "../adapters";

const apiClient = createApiClient();

export const categoriesService = {
    async getCategory(
        id: number,
        useCache: boolean = true
    ): Promise<CategoryInterface> {
        if (useCache) {
            const cached = getCachedCategory<CategoryInterface>(id);
            if (cached) return cached;
        }

        try {
            // SIEMPRE intentar API real primero
            const apiCategory = await apiClient.get<ApiCategory>(
                `${ENDPOINTS.CATEGORIES}/${id}`
            );

            if (!validateApiCategory(apiCategory)) {
                throw new Error(`Categoría con estructura inválida: ${id}`);
            }

            const adaptedCategory = adaptApiCategory(apiCategory);
            cacheCategory(id, adaptedCategory);
            return adaptedCategory;
        } catch (error: any) {
            console.warn(`🔧 API falló para categoría ${id}:`, error.message);

            // SOLO usar mock si la API definitivamente no está disponible
            if (error.status === 404) {
                // Si la categoría no existe en la API, buscar en mock
                const mockCategory = MOCK_CATEGORIES.find((c) => c.id === id);
                if (mockCategory) {
                    console.log(`📦 Usando categoría mock para ID ${id}`);
                    return mockCategory;
                }
            } else if (error.message?.includes("fetch")) {
                // Si hay problema de red, usar mock temporalmente
                const mockCategory = MOCK_CATEGORIES.find((c) => c.id === id);
                if (mockCategory) {
                    console.log(
                        `🌐 API no disponible, usando mock para ID ${id}`
                    );
                    return mockCategory;
                }
            }

            throw new Error(
                `Categoría con ID ${id} no encontrada en API ni en datos locales`
            );
        }
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

        try {
            // PRIORIZAR API real
            const apiCategories = await apiClient.get<ApiCategory[]>(
                ENDPOINTS.CATEGORIES
            );

            // Aplanar la estructura jerárquica a una lista plana
            const flattenedCategories = flattenCategories(apiCategories);

            cacheSearchResults(cacheKey, flattenedCategories);
            return flattenedCategories;
        } catch (error: any) {
            console.warn(
                "🔧 API de categorías no disponible, usando datos de ejemplo"
            );
            return MOCK_CATEGORIES;
        }
    },

    /**
     * Obtiene categorías con su estructura jerárquica completa
     */
    async getCategoriesHierarchical(useCache: boolean = true) {
        const cacheKey = "hierarchical-categories";

        if (useCache) {
            const cached = getCachedSearchResults(cacheKey);
            if (cached) return cached;
        }

        try {
            // PRIORIZAR API real
            const apiCategories = await apiClient.get<ApiCategory[]>(
                ENDPOINTS.CATEGORIES
            );

            const organized = organizeHierarchicalCategories(apiCategories);

            cacheSearchResults(cacheKey, organized);
            return organized;
        } catch (error: any) {
            console.warn("🔧 API no disponible para categorías jerárquicas");
            // Fallback con mock data organizado
            return {
                mainCategories: MOCK_CATEGORIES.filter((cat) => !cat.fatherId),
                subcategories: MOCK_CATEGORIES.filter((cat) => cat.fatherId),
                allCategories: MOCK_CATEGORIES,
                getSubcategoriesOf: (parentId: number) =>
                    MOCK_CATEGORIES.filter((cat) => cat.fatherId === parentId),
                getCategoryById: (id: number) =>
                    MOCK_CATEGORIES.find((cat) => cat.id === id),
            };
        }
    },

    /**
     * Obtiene productos de una categoría específica
     */
    async getCategoryProducts(categoryId: number, useCache: boolean = true) {
        const cacheKey = `category-products-${categoryId}`;

        if (useCache) {
            const cached = getCachedSearchResults(cacheKey);
            if (cached) return cached;
        }

        try {
            // PRIORIZAR API real
            const apiCategory = await apiClient.get<ApiCategory>(
                `${ENDPOINTS.CATEGORIES}/${categoryId}`
            );

            const products = extractProductsFromCategory(apiCategory);

            cacheSearchResults(cacheKey, products);
            return products;
        } catch (error: any) {
            console.warn(
                `🔧 API no disponible para productos de categoría ${categoryId}`
            );

            // Fallback: usar mock data filtrado por categoría
            return (
                MOCK_PRODUCTS.filter((product) =>
                    product.categories.some((cat) => cat.id === categoryId)
                ) || []
            );
        }
    },
};
