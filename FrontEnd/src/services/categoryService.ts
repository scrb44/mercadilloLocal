// src/services/categoriesService.ts
import { createApiClient } from "./api";
import {
    cacheCategory,
    getCachedCategory,
    cacheSearchResults,
    getCachedSearchResults,
} from "./cache";
import { MOCK_CATEGORIES } from "./mockData";
import { type CategoryInterface } from "../types/types";

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
            const category = await apiClient.get<CategoryInterface>(
                `categories/${id}`
            );
            cacheCategory(id, category);
            return category;
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
            const categories = await apiClient.get<CategoryInterface[]>(
                "categories"
            );
            cacheSearchResults(cacheKey, categories);
            return categories;
        } catch (error) {
            console.warn(
                "🔧 API no disponible para categorías, usando datos de ejemplo"
            );
            return MOCK_CATEGORIES;
        }
    },
};
