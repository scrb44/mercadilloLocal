// src/services/categoryService.ts - Servicio para gestión de categorías con localidad

import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import {
    cacheCategory,
    getCachedCategory,
    cacheSearchResults,
    getCachedSearchResults,
} from "./cache";
import { type CategoryInterface } from "../types/types";
import { type ApiCategory } from "../types/apiTypes";

const apiClient = createApiClient();

/**
 * Adaptador para convertir ApiCategory a CategoryInterface
 */
function adaptApiCategory(apiCategory: ApiCategory): CategoryInterface {
    return {
        id: apiCategory.id,
        name: apiCategory.nombre,
        img: apiCategory.imagen || "",
        fatherId: apiCategory.categoriaPadre?.id,
    };
}

/**
 * Valida que una categoría de la API tenga los campos mínimos necesarios
 */
function validateApiCategory(apiCategory: any): apiCategory is ApiCategory {
    return (
        typeof apiCategory === "object" &&
        typeof apiCategory.id === "number" &&
        typeof apiCategory.nombre === "string"
    );
}

/**
 * Filtra y adapta categorías válidas, ignorando las inválidas
 */
function adaptValidApiCategories(apiCategories: any[]): CategoryInterface[] {
    return apiCategories.filter(validateApiCategory).map(adaptApiCategory);
}

export const categoryService = {
    /**
     * Obtiene todas las categorías (sin filtro de localidad)
     */
    async getAllCategories(
        useCache: boolean = true
    ): Promise<CategoryInterface[]> {
        try {
            const cacheKey = "all-categories";

            if (useCache) {
                const cached =
                    getCachedSearchResults<CategoryInterface[]>(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            const apiCategories = await apiClient.get<ApiCategory[]>(
                ENDPOINTS.CATEGORIES
            );
            const adaptedCategories = adaptValidApiCategories(apiCategories);

            cacheSearchResults(cacheKey, adaptedCategories);
            return adaptedCategories;
        } catch (error: any) {
            console.warn("🔧 API de categorías no disponible:", error.message);
            throw new Error("Error al cargar las categorías");
        }
    },

    /**
     * Obtiene categorías que tienen productos en una localidad específica
     */
    async getCategoriesByLocalidad(
        localidadId: number,
        useCache: boolean = true
    ): Promise<CategoryInterface[]> {
        try {
            const cacheKey = `categories-localidad-${localidadId}`;

            if (useCache) {
                const cached =
                    getCachedSearchResults<CategoryInterface[]>(cacheKey);
                if (cached) {
                    return cached;
                }
            }

            // ✅ Usar el endpoint con parámetro localidad según CategoriaController
            const params = new URLSearchParams();
            params.append("localidad", localidadId.toString());

            const url = `${ENDPOINTS.CATEGORIES}?${params.toString()}`;
            const apiCategories = await apiClient.get<ApiCategory[]>(url);
            const adaptedCategories = adaptValidApiCategories(apiCategories);

            cacheSearchResults(cacheKey, adaptedCategories);
            return adaptedCategories;
        } catch (error: any) {
            console.warn(
                `🔧 API de categorías falló para localidad ${localidadId}:`,
                error.message
            );
            throw new Error(
                "Error al cargar las categorías para la localidad seleccionada"
            );
        }
    },

    /**
     * Obtiene una categoría específica por ID
     */
    async getCategoryById(
        id: number,
        useCache: boolean = true
    ): Promise<CategoryInterface | null> {
        try {
            if (useCache) {
                const cached = getCachedCategory<CategoryInterface>(id);
                if (cached) {
                    return cached;
                }
            }

            const apiCategory = await apiClient.get<ApiCategory>(
                `${ENDPOINTS.CATEGORIES}/${id}`
            );
            const adaptedCategory = adaptApiCategory(apiCategory);

            cacheCategory(id, adaptedCategory);
            return adaptedCategory;
        } catch (error: any) {
            if (error.status === 404) {
                return null; // Categoría no encontrada
            }
            console.warn(
                `🔧 API de categoría falló para ID ${id}:`,
                error.message
            );
            throw new Error("Error al cargar la categoría");
        }
    },

    /**
     * Invalida el cache de categorías
     */
    async refreshCategories(): Promise<void> {
        // Limpiar cache de categorías usando las funciones existentes
        Object.keys(localStorage).forEach((key) => {
            if (
                key.includes("categories") ||
                key.includes("category-") ||
                key.includes("mercadillo-category-")
            ) {
                localStorage.removeItem(key);
            }
        });
    },
};

// Exportar también como default para compatibilidad
export default categoryService;
