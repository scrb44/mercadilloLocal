// src/services/vendorProductsService.ts - Servicio para CRUD de productos con JWT

import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import { type ProductInterface, type ProductFormData } from "../types/types";
import {
    type ApiProduct,
    type CreateProductRequest,
    type UpdateProductRequest,
} from "../types/apiTypes";
import { adaptApiProduct, validateApiProduct } from "../adapters";

const apiClient = createApiClient();

// Cliente HTTP que incluye JWT automáticamente
async function createAuthenticatedRequest(
    url: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(
        url.startsWith("http") ? url : `http://localhost:8080${url}`,
        {
            ...options,
            headers,
        }
    );

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("No tienes permisos para realizar esta acción");
        }
        if (response.status === 403) {
            throw new Error("Acceso denegado");
        }
        throw new Error(`Error HTTP: ${response.status}`);
    }

    return response;
}

export const vendorProductsService = {
    /**
     * Obtiene todos los productos del vendedor autenticado
     */
    async getVendorProducts(): Promise<ProductInterface[]> {
        try {
            const response = await createAuthenticatedRequest(
                `${ENDPOINTS.PRODUCTS}/vendor/me`
            );
            const apiProducts = await response.json();

            if (!Array.isArray(apiProducts)) {
                // Si no hay productos, devolver array vacío
                return [];
            }

            return apiProducts.filter(validateApiProduct).map(adaptApiProduct);
        } catch (error: any) {
            console.error("Error obteniendo productos del vendedor:", error);
            throw new Error(error.message || "Error al cargar tus productos");
        }
    },

    /**
     * Crea un nuevo producto
     */
    async createProduct(
        productData: ProductFormData
    ): Promise<ProductInterface> {
        try {
            const request: CreateProductRequest = {
                nombre: productData.name,
                descripcion: productData.description,
                precio: productData.price,
                imagen: productData.imagen || "",
                categoriaIds: productData.categoryIds,
            };

            const response = await createAuthenticatedRequest(
                ENDPOINTS.PRODUCTS,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );

            const apiProduct = await response.json();

            if (!validateApiProduct(apiProduct)) {
                throw new Error("Respuesta inválida del servidor");
            }

            return adaptApiProduct(apiProduct);
        } catch (error: any) {
            console.error("Error creando producto:", error);
            throw new Error(error.message || "Error al crear el producto");
        }
    },

    /**
     * Actualiza un producto existente
     */
    async updateProduct(
        id: number,
        productData: ProductFormData
    ): Promise<ProductInterface> {
        try {
            const request: UpdateProductRequest = {
                id,
                nombre: productData.name,
                descripcion: productData.description,
                precio: productData.price,
                imagen: productData.imagen || "",
                categoriaIds: productData.categoryIds,
            };

            const response = await createAuthenticatedRequest(
                `${ENDPOINTS.PRODUCTS}/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(request),
                }
            );

            const apiProduct = await response.json();

            if (!validateApiProduct(apiProduct)) {
                throw new Error("Respuesta inválida del servidor");
            }

            return adaptApiProduct(apiProduct);
        } catch (error: any) {
            console.error(`Error actualizando producto ${id}:`, error);
            throw new Error(error.message || "Error al actualizar el producto");
        }
    },

    /**
     * Elimina un producto
     */
    async deleteProduct(id: number): Promise<void> {
        try {
            await createAuthenticatedRequest(`${ENDPOINTS.PRODUCTS}/${id}`, {
                method: "DELETE",
            });
        } catch (error: any) {
            console.error(`Error eliminando producto ${id}:`, error);
            throw new Error(error.message || "Error al eliminar el producto");
        }
    },

    /**
     * Sube una imagen y retorna la URL
     */
    async uploadProductImage(file: File): Promise<string> {
        try {
            const formData = new FormData();
            formData.append("image", file);

            const token = localStorage.getItem("token");
            const response = await fetch(
                `http://localhost:8080${ENDPOINTS.PRODUCTS}/upload-image`,
                {
                    method: "POST",
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` }),
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Error subiendo imagen");
            }

            const result = await response.json();
            return result.url || result.imageUrl;
        } catch (error: any) {
            console.error("Error subiendo imagen:", error);
            // Por ahora, retornamos un placeholder
            return "https://via.placeholder.com/400x300?text=Imagen+de+Producto";
        }
    },

    /**
     * Valida los datos del producto antes de enviar
     */
    validateProductData(data: ProductFormData): {
        valid: boolean;
        errors: string[];
    } {
        const errors: string[] = [];

        if (!data.name || data.name.trim().length < 3) {
            errors.push("El nombre debe tener al menos 3 caracteres");
        }

        if (data.name && data.name.length > 100) {
            errors.push("El nombre no puede superar los 100 caracteres");
        }

        if (!data.description || data.description.trim().length < 10) {
            errors.push("La descripción debe tener al menos 10 caracteres");
        }

        if (data.description && data.description.length > 1000) {
            errors.push("La descripción no puede superar los 1000 caracteres");
        }

        if (!data.price || data.price <= 0) {
            errors.push("El precio debe ser mayor a 0");
        }

        if (data.price > 99999) {
            errors.push("El precio no puede superar los 99,999€");
        }

        if (!data.categoryIds || data.categoryIds.length === 0) {
            errors.push("Debe seleccionar al menos una categoría");
        }

        if (data.categoryIds && data.categoryIds.length > 5) {
            errors.push("Máximo 5 categorías por producto");
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    },

    /**
     * Crea un producto vacío para formularios
     */
    createEmptyProductForm(): ProductFormData {
        return {
            name: "",
            description: "",
            price: 0,
            imagen: "",
            categoryIds: [],
        };
    },
};

export default vendorProductsService;
