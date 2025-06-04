// src/adapters/productAdapter.ts - Adaptador para productos

import {
    type ProductInterface,
    type VendedorInterface,
    type CategoryInterface,
} from "../types/types";
import { type ApiProduct } from "../types/apiTypes";
import { PlaceholderURL } from "../constants";
/**
 * Convierte un producto de la API al formato que usa el frontend
 */
export function adaptApiProduct(apiProduct: ApiProduct): ProductInterface {
    return {
        id: apiProduct.id,
        name: apiProduct.nombre,
        description: apiProduct.descripcion || "Sin descripción",
        price: apiProduct.precio,
        img: apiProduct.imagen
            ? [apiProduct.imagen]
            : [PlaceholderURL],
        video: [], // La API no devuelve videos por ahora

        // Valores por defecto para campos que la API no incluye aún
        vendedor: createDefaultVendor(),
        categories: createDefaultCategories(),
    };
}

/**
 * Convierte múltiples productos de la API
 */
export function adaptApiProducts(
    apiProducts: ApiProduct[]
): ProductInterface[] {
    return apiProducts.map(adaptApiProduct);
}

/**
 * Convierte un producto del frontend al formato de la API (para POST/PUT)
 */
export function adaptProductToApi(
    product: ProductInterface
): Partial<ApiProduct> {
    return {
        nombre: product.name,
        descripcion: product.description,
        precio: product.price,
        imagen: product.img[0] || "",
        // Agregar otros campos según lo que acepte la API
    };
}

// ============ FUNCIONES AUXILIARES ============

function createDefaultVendor(): VendedorInterface {
    return {
        id: 0,
        name: "Sin especificar",
        img: "",
    };
}

function createDefaultCategories(): CategoryInterface[] {
    return [
        {
            id: 0,
            name: "Sin categoría",
            img: "",
        },
    ];
}

// ============ FUNCIONES DE VALIDACIÓN ============

/**
 * Valida que un producto de la API tenga los campos mínimos necesarios
 */
export function validateApiProduct(apiProduct: any): apiProduct is ApiProduct {
    return (
        typeof apiProduct === "object" &&
        typeof apiProduct.id === "number" &&
        typeof apiProduct.nombre === "string" &&
        typeof apiProduct.precio === "number"
    );
}

/**
 * Filtra y adapta productos válidos, ignorando los inválidos
 */
export function adaptValidApiProducts(apiProducts: any[]): ProductInterface[] {
    return apiProducts.filter(validateApiProduct).map(adaptApiProduct);
}
