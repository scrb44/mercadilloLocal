// src/services/categoryService.ts - ACTUALIZADO CON ADAPTADORES para estructura real
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import {
    cacheCategory,
    getCachedCategory,
    cacheSearchResults,
    getCachedSearchResults,
} from "./cache";
import { MOCK_CATEGORIES } from "./mockData";
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
            // La API devuelve ApiCategory, lo adaptamos a CategoryInterface
            const apiCategory = await apiClient.get<ApiCategory>(
                `${ENDPOINTS.CATEGORIES}/${id}`
            );

            if (!validateApiCategory(apiCategory)) {
                throw new Error(`Categoría con estructura inválida: ${id}`);
            }

            const adaptedCategory = adaptApiCategory(apiCategory);
            cacheCategory(id, adaptedCategory);
            return adaptedCategory;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para categoría, usando datos de ejemplo"
            );
            const mockCategory = MOCK_CATEGORIES.find((c) => c.id === id);
            if (mockCategory) return mockCategory;
            throw new Error(`Categoría con ID ${id} no encontrada`);
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
            // La API devuelve un array de ApiCategory con estructura jerárquica
            const apiCategories = await apiClient.get<ApiCategory[]>(
                ENDPOINTS.CATEGORIES
            );

            // Aplanar la estructura jerárquica a una lista plana
            const flattenedCategories = flattenCategories(apiCategories);

            cacheSearchResults(cacheKey, flattenedCategories);
            return flattenedCategories;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para categorías, usando datos de ejemplo"
            );
            return MOCK_CATEGORIES;
        }
    },

    /**
     * NUEVA: Obtiene categorías con su estructura jerárquica completa
     */
    async getCategoriesHierarchical(useCache: boolean = true) {
        const cacheKey = "hierarchical-categories";

        if (useCache) {
            const cached = getCachedSearchResults(cacheKey);
            if (cached) return cached;
        }

        try {
            const apiCategories = await apiClient.get<ApiCategory[]>(
                ENDPOINTS.CATEGORIES
            );

            const organized = organizeHierarchicalCategories(apiCategories);

            cacheSearchResults(cacheKey, organized);
            return organized;
        } catch (error) {
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
     * NUEVA: Obtiene productos de una categoría específica
     */
    async getCategoryProducts(categoryId: number, useCache: boolean = true) {
        const cacheKey = `category-products-${categoryId}`;

        if (useCache) {
            const cached = getCachedSearchResults(cacheKey);
            if (cached) return cached;
        }

        try {
            // Obtener la categoría completa con sus productos
            const apiCategory = await apiClient.get<ApiCategory>(
                `${ENDPOINTS.CATEGORIES}/${categoryId}`
            );

            const products = extractProductsFromCategory(apiCategory);

            cacheSearchResults(cacheKey, products);
            return products;
        } catch (error) {
            console.warn(
                `🔧 API no disponible para productos de categoría ${categoryId}`
            );
            return [];
        }
    },
};
