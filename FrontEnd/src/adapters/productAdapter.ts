// src/adapters/productAdapter.ts - Adaptador para productos

import {
    type ProductInterface,
    type VendedorInterface,
    type CategoryInterface,
    type Localidad,
} from "../types/types";
import { type ApiProduct } from "../types/apiTypes";

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
            : [
                  "https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg",
              ],
        video: [], // La API no devuelve videos por ahora

        // Aquí adaptamos el vendedor real que viene del backend
        vendedor: adaptApiVendor(apiProduct.vendedor),

        // Adaptamos categorías si existen o usamos default
        categories: apiProduct.categorias
            ? apiProduct.categorias.map(adaptApiCategory)
            : createDefaultCategories(),
        municipality: adaptApiMunicipality(apiProduct.vendedor?.localidad),
    };
}

/**
 * Adaptador para localidad/municipio
 */
function adaptApiMunicipality(apiLocalidad: any): Localidad {
    if (!apiLocalidad) return createDefaultMunicipality();

    return {
        id: apiLocalidad.id,
        nombre: apiLocalidad.nombre,
        provincia: apiLocalidad.provincia || null,
    };
}

/**
 * Adaptador para vendedor
 */
function adaptApiVendor(apiVendor: any): VendedorInterface {
    if (!apiVendor) return createDefaultVendor();

    return {
        id: apiVendor.id,
        name: apiVendor.nombre || apiVendor.name,
        img: apiVendor.imagen || apiVendor.img || "",
        nombre: apiVendor.nombre,
        imagen: apiVendor.imagen || "",
        email: apiVendor.email,
        usuario: apiVendor.usuario,
        verificado: apiVendor.verificado,
        localidad: apiVendor.localidad ? apiVendor.localidad.nombre : undefined,
        telf: apiVendor.telf,
    };
}

/**
 * Adaptador para categoría
 */
function adaptApiCategory(apiCategory: any): CategoryInterface {
    return {
        id: apiCategory.id,
        name: apiCategory.nombre,
        img: apiCategory.imagen || "",
        fatherId: apiCategory.categoriaPadre
            ? apiCategory.categoriaPadre.id
            : undefined,
    };
}

/**
 * Valores por defecto para municipio (cuando no hay)
 */
function createDefaultMunicipality(): Localidad {
    return {
        id: 0,
        nombre: "Sin especificar",
        provincia: null,
    };
}

/**
 * Valores por defecto para vendedor (cuando no hay)
 */
function createDefaultVendor(): VendedorInterface {
    return {
        id: 0,
        name: "Sin especificar",
        img: "",
        nombre: "Sin especificar",
        imagen: "",
        email: undefined,
        usuario: undefined,
        verificado: undefined,
        localidad: undefined,
        telf: undefined,
    };
}

/**
 * Valores por defecto para categorías
 */
function createDefaultCategories(): CategoryInterface[] {
    return [
        {
            id: 0,
            name: "Sin categoría",
            img: "",
        },
    ];
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
