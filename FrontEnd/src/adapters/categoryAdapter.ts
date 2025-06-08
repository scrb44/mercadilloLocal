// src/adapters/categoryAdapter.ts - ACTUALIZADO para estructura real de la API

import { type CategoryInterface } from "../types/types";
import { type ApiCategory } from "../types/apiTypes";
import { adaptApiProducts } from "./productAdapter";

/**
 * Convierte una categoría de la API al formato que usa el frontend
 */
export function adaptApiCategory(apiCategory: ApiCategory): CategoryInterface {
    const result: CategoryInterface = {
        id: apiCategory.id,
        name: apiCategory.nombre, // 🔧 API usa "nombre", frontend usa "name"
        img: apiCategory.imagen || "", // 🔧 API usa "imagen", frontend usa "img"
        fatherId: apiCategory.categoriaPadre?.id, // 🔧 API usa "categoriaPadre", frontend usa "fatherId"
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
        nombre: category.name, // 🔧 Frontend usa "name", API espera "nombre"
        imagen: category.img || null, // 🔧 Frontend usa "img", API espera "imagen"
        // categoriaPadre: category.fatherId ? { id: category.fatherId } : null,
    };
}

// ============ FUNCIONES ESPECIALES PARA LA ESTRUCTURA RICA ============

/**
 * Extrae todos los productos de todas las categorías
 * (La API devuelve productos anidados en cada categoría)
 */
export function extractAllProductsFromCategories(apiCategories: ApiCategory[]) {
    const allProducts = apiCategories.flatMap(
        (category) => adaptApiProducts(category.productos || []) // 🔧 Manejar productos undefined
    );

    return allProducts;
}

/**
 * Extrae productos de una categoría específica
 */
export function extractProductsFromCategory(apiCategory: ApiCategory) {
    return adaptApiProducts(apiCategory.productos || []); // 🔧 Manejar productos undefined
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
            name: apiCategory.nombre, // 🔧 Usar "nombre" de la API
            img: apiCategory.imagen || "", // 🔧 Usar "imagen" de la API
            fatherId: parentId, // 🔧 Usar parentId pasado como parámetro
        };
        flattened.push(category);

        // Procesar subcategorías recursivamente
        if (apiCategory.subcategorias && apiCategory.subcategorias.length > 0) {
            apiCategory.subcategorias.forEach((subcategory) => {
                processCategory(subcategory, apiCategory.id);
            });
        }
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
    const isValid =
        typeof apiCategory === "object" &&
        typeof apiCategory.id === "number" &&
        typeof apiCategory.nombre === "string"; // 🔧 Validar "nombre" en lugar de "name"
    // No validar productos y subcategorias como requeridos porque pueden ser undefined

    if (!isValid) {
        console.log("❌ Categoría API inválida:", apiCategory);
    }

    return isValid;
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
        (category.productos || []) // 🔧 Manejar productos undefined
            .filter(
                (product) =>
                    product.nombre.toLowerCase().includes(query) ||
                    (product.descripcion &&
                        product.descripcion.toLowerCase().includes(query))
            )
            .map((product) => ({
                ...adaptApiProduct(product),
                categoryId: category.id,
                categoryName: category.nombre, // 🔧 Usar "nombre" de la API
            }))
    );
}

// Importar adaptApiProduct para usar en searchProductsInCategories
import { adaptApiProduct } from "./productAdapter";
