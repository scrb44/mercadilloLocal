// src/adapters/categoryAdapter.ts - ACTUALIZADO para estructura real de la API

import { type CategoryInterface } from "../types/types";
import { type ApiCategory } from "../types/apiTypes";
import { adaptApiProducts } from "./productAdapter";

/**
 * Convierte una categoría de la API al formato que usa el frontend
 */
export function adaptApiCategory(apiCategory: ApiCategory): CategoryInterface {
    const result = {
        id: apiCategory.id,
        name: apiCategory.nombre,
        img: apiCategory.imagen || "",
        fatherId: apiCategory.categoriaPadre?.id,
    };
    return result;
}

/**
 * Convierte múltiples categorías de la API
 */
export function adaptApiCategories(
    apiCategories: ApiCategory[]
): CategoryInterface[] {
    return apiCategories.map(adaptApiCategory);
}

/**
 * Convierte una categoría del frontend al formato de la API (para POST/PUT)
 */
export function adaptCategoryToApi(
    category: CategoryInterface
): Partial<ApiCategory> {
    return {
        nombre: category.name,
        imagen: category.img || null,
        // categoriaPadre: category.fatherId ? { id: category.fatherId } : null,
    };
}

// ============ FUNCIONES ESPECIALES PARA LA ESTRUCTURA RICA ============

/**
 * Extrae todos los productos de todas las categorías
 * (La API devuelve productos anidados en cada categoría)
 */
export function extractAllProductsFromCategories(apiCategories: ApiCategory[]) {
    const allProducts = apiCategories.flatMap((category) =>
        adaptApiProducts(category.productos)
    );

    return allProducts;
}

/**
 * Extrae productos de una categoría específica
 */
export function extractProductsFromCategory(apiCategory: ApiCategory) {
    return adaptApiProducts(apiCategory.productos);
}

/**
 * Aplana la estructura jerárquica de subcategorías
 */
export function flattenCategories(
    apiCategories: ApiCategory[]
): CategoryInterface[] {
    const flattened: CategoryInterface[] = [];

    function processCategory(apiCategory: ApiCategory, parentId?: number) {
        // Agregar la categoría actual
        const category: CategoryInterface = {
            id: apiCategory.id,
            name: apiCategory.nombre,
            img: apiCategory.imagen || "",
            fatherId: parentId,
        };
        flattened.push(category);

        // Procesar subcategorías recursivamente
        apiCategory.subcategorias.forEach((subcategory) => {
            processCategory(subcategory, apiCategory.id);
        });
    }

    // Procesar todas las categorías principales
    apiCategories.forEach((category) => {
        processCategory(category);
    });

    return flattened;
}

/**
 * Organiza categorías manteniendo la estructura jerárquica
 */
export function organizeHierarchicalCategories(apiCategories: ApiCategory[]) {
    const flattened = flattenCategories(apiCategories);
    const mainCategories = flattened.filter((cat) => !cat.fatherId);
    const subcategories = flattened.filter((cat) => cat.fatherId);

    return {
        mainCategories,
        subcategories,
        allCategories: flattened,
        getSubcategoriesOf: (parentId: number) =>
            subcategories.filter((cat) => cat.fatherId === parentId),
        getCategoryById: (id: number) => flattened.find((cat) => cat.id === id),
    };
}

// ============ FUNCIONES DE VALIDACIÓN ============

/**
 * Valida que una categoría de la API tenga los campos mínimos necesarios
 */
export function validateApiCategory(
    apiCategory: any
): apiCategory is ApiCategory {
    return (
        typeof apiCategory === "object" &&
        typeof apiCategory.id === "number" &&
        typeof apiCategory.nombre === "string" &&
        Array.isArray(apiCategory.productos) &&
        Array.isArray(apiCategory.subcategorias)
    );
}

/**
 * Filtra y adapta categorías válidas, ignorando las inválidas
 */
export function adaptValidApiCategories(
    apiCategories: any[]
): CategoryInterface[] {
    return apiCategories
        .filter(validateApiCategory)
        .flatMap((category) => flattenCategories([category]));
}

// ============ FUNCIONES DE BÚSQUEDA ============

/**
 * Busca productos en todas las categorías por texto
 */
export function searchProductsInCategories(
    apiCategories: ApiCategory[],
    searchQuery: string
) {
    const query = searchQuery.toLowerCase();

    return apiCategories.flatMap((category) =>
        category.productos
            .filter(
                (product) =>
                    product.nombre.toLowerCase().includes(query) ||
                    product.descripcion.toLowerCase().includes(query)
            )
            .map((product) => ({
                ...adaptApiProduct(product),
                categoryId: category.id,
                categoryName: category.nombre,
            }))
    );
}

// Importar adaptApiProduct para usar en searchProductsInCategories
import { adaptApiProduct } from "./productAdapter";
