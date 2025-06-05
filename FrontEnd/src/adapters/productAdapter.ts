// src/adapters/productAdapter.ts - ACTUALIZADO para nueva estructura

import {
    type ProductInterface,
    type VendedorInterface,
    type CategoryInterface,
} from "../types/types";
import { type ApiProduct, type ApiProductRequest } from "../types/apiTypes";
import { PlaceholderURL } from "../constants";

/**
 * Convierte un producto de la API al formato que usa el frontend
 */
export function adaptApiProduct(apiProduct: ApiProduct): ProductInterface {
    return {
        id: apiProduct.id,
        name: apiProduct.nombre,
        description: apiProduct.descripcion || "Sin descripción",
        price: Number(apiProduct.precio),
        img: apiProduct.imagen ? [apiProduct.imagen] : [PlaceholderURL],
        video: [], // La API no devuelve videos por ahora
        vendedor: {
            id: apiProduct.vendedor.id,
            name: apiProduct.vendedor.nombre,
            img: apiProduct.vendedor.imagen || "",
        },
        categories: apiProduct.categorias.map((cat) => ({
            id: cat.id,
            name: cat.nombre,
            img: cat.imagen || "",
            fatherId: cat.categoriaPadre?.id,
        })),
    };
}

/**
 * Adapta el vendedor de la API
 */
function adaptApiVendedor(apiVendedor: any): VendedorInterface {
    if (!apiVendedor) {
        return createDefaultVendor();
    }

    return {
        id: apiVendedor.id,
        name: apiVendedor.nombre || apiVendedor.usuario,
        img: apiVendedor.imagen || "",
        email: apiVendedor.email,
        usuario: apiVendedor.usuario,
        verificado: apiVendedor.verificado,
        localidad: apiVendedor.localidad?.nombre,
    };
}

/**
 * Adapta las categorías de la API
 */
function adaptApiCategory(apiCategory: any): CategoryInterface {
    return {
        id: apiCategory.id,
        name: apiCategory.nombre,
        img: apiCategory.imagen || "",
        fatherId: apiCategory.categoriaPadre?.id,
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
    product: Partial<ProductInterface>
): Partial<ApiProductRequest> {
    return {
        nombre: product.name,
        descripcion: product.description,
        precio: product.price,
        imagen: product.img?.[0] || "",
        categorias: product.categories?.map((cat) => cat.id),
        vendedorId: product.vendedor?.id,
    };
}

/**
 * Crea un producto vacío para formularios
 */
export function createEmptyProduct(): Partial<ProductInterface> {
    return {
        name: "",
        description: "",
        price: 0,
        img: [],
        categories: [],
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

// ============ FUNCIONES DE VALIDACIÓN ============

/**
 * Valida que un producto de la API tenga los campos mínimos necesarios
 */
export function validateApiProduct(apiProduct: any): apiProduct is ApiProduct {
    return (
        typeof apiProduct === "object" &&
        typeof apiProduct.id === "number" &&
        typeof apiProduct.nombre === "string" &&
        (typeof apiProduct.precio === "number" ||
            typeof apiProduct.precio === "object") // BigDecimal
    );
}

/**
 * Filtra y adapta productos válidos, ignorando los inválidos
 */
export function adaptValidApiProducts(apiProducts: any[]): ProductInterface[] {
    return apiProducts.filter(validateApiProduct).map(adaptApiProduct);
}
