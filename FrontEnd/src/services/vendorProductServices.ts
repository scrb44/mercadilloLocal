// src/services/vendorProductsService.ts - USANDO ENDPOINT /api/auth/perfil

import { ENDPOINTS } from "../constants";
import { type ProductInterface, type ProductFormData } from "../types/types";

const API_BASE_URL = "http://localhost:8080";

let isCreatingProduct = false;
let isUpdatingProduct: Record<number, boolean> = {};
let isDeletingProduct: Record<number, boolean> = {};

// ============ OBTENER ID DEL VENDEDOR DESDE /api/auth/perfil ============

async function getCurrentVendorId(): Promise<number> {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No hay token de autenticación");
        }

        console.log("🔍 Obteniendo perfil del usuario...");

        const response = await fetch(`${API_BASE_URL}/api/auth/perfil`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                localStorage.removeItem("token");
                throw new Error("Sesión expirada. Inicia sesión nuevamente.");
            }
            throw new Error(`Error obteniendo perfil: ${response.status}`);
        }

        const userProfile = await response.json();
        console.log("👤 Perfil obtenido:", userProfile);

        // Verificar que sea vendedor
        if (userProfile.rol !== "VENDEDOR") {
            throw new Error("Solo los vendedores pueden gestionar productos");
        }

        // Extraer ID del perfil
        const vendorId = userProfile.id;
        if (!vendorId || isNaN(Number(vendorId))) {
            throw new Error("ID del vendedor no válido");
        }

        console.log("✅ ID del vendedor:", vendorId);
        return Number(vendorId);
    } catch (error: any) {
        console.error("❌ Error obteniendo perfil del vendedor:", error);
        throw error;
    }
}

// Función helper para crear requests autenticados
async function createAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error(
            "No se encontró token de autenticación. Debes iniciar sesión."
        );
    }

    const url = endpoint.startsWith("http")
        ? endpoint
        : `${API_BASE_URL}${endpoint}`;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    console.log("🔄 Request details:");
    console.log("URL:", url);
    console.log("Method:", options.method || "GET");
    if (options.body) {
        console.log("Body:", options.body);
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        console.log("📥 Response status:", response.status);

        if (!response.ok) {
            let errorMessage = `Error HTTP: ${response.status}`;
            try {
                const errorBody = await response.clone().text();
                console.log("❌ Error response body:", errorBody);

                try {
                    const errorJson = JSON.parse(errorBody);
                    if (errorJson.message || errorJson.mensaje) {
                        errorMessage = errorJson.message || errorJson.mensaje;
                    }
                } catch {
                    if (errorBody && errorBody.length < 200) {
                        errorMessage = errorBody;
                    }
                }
            } catch (e) {
                console.log("No se pudo leer el cuerpo del error");
            }

            if (response.status === 401) {
                localStorage.removeItem("token");
                throw new Error(
                    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
                );
            }
            if (response.status === 403) {
                throw new Error(
                    "No tienes permisos para realizar esta acción."
                );
            }
            if (response.status === 404) {
                throw new Error("Recurso no encontrado.");
            }
            if (response.status >= 500) {
                throw new Error("Error en el servidor. Intenta más tarde.");
            }

            throw new Error(errorMessage);
        }

        return response;
    } catch (error: any) {
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            throw new Error("Error de conexión. Verifica tu internet.");
        }
        throw error;
    }
}

export const vendorProductsService = {
    /**
     * Obtiene todos los productos del vendedor
     */
    async getVendorProducts(): Promise<ProductInterface[]> {
        try {
            // Obtener ID del vendedor desde el perfil
            const vendorId = await getCurrentVendorId();

            console.log("🔍 Buscando productos para vendedor ID:", vendorId);

            // Obtener productos filtrados por vendedor
            const productsResponse = await createAuthenticatedRequest(
                `${ENDPOINTS.PRODUCTS}?vendedor=${vendorId}`
            );
            const vendorProducts = await productsResponse.json();

            if (!Array.isArray(vendorProducts)) {
                console.log("⚠️ Respuesta no es array:", vendorProducts);
                return [];
            }

            // Adaptar productos al formato frontend
            const adaptedProducts = vendorProducts.map((apiProduct: any) => ({
                id: apiProduct.id,
                name: apiProduct.nombre || apiProduct.name,
                description: apiProduct.descripcion || apiProduct.description,
                price: Number(apiProduct.precio || apiProduct.price),
                img: apiProduct.imagen ? [apiProduct.imagen] : [],
                categories:
                    apiProduct.categorias || apiProduct.categories || [],
                vendedor: {
                    id: vendorId,
                    name:
                        apiProduct.vendedor?.nombre ||
                        apiProduct.vendedor?.usuario ||
                        "Mi Tienda",
                    img: apiProduct.vendedor?.imagen || "",
                },
                municipality: {
                    id: 1,
                    nombre: "Sin especificar",
                    provincia: "Málaga",
                },
            }));

            console.log("📦 Productos encontrados:", adaptedProducts.length);
            return adaptedProducts;
        } catch (error: any) {
            console.error("❌ Error cargando productos:", error);
            throw new Error(error.message || "Error al cargar tus productos");
        }
    },

    /**
     * Crea un nuevo producto
     */
    async createProduct(
        productData: ProductFormData
    ): Promise<ProductInterface> {
        if (isCreatingProduct) {
            throw new Error(
                "Ya se está creando un producto. Por favor espera."
            );
        }

        try {
            isCreatingProduct = true;

            // Obtener ID del vendedor desde el perfil
            const vendorId = await getCurrentVendorId();

            console.log("👤 Creando producto para vendedor ID:", vendorId);

            // ESTRUCTURA según el modelo Producto.java
            const request = {
                nombre: productData.name.trim(),
                descripcion: productData.description.trim(),
                precio: Number(productData.price),
                imagen: productData.imagen || "",
                vendedor: {
                    id: vendorId,
                },
                categorias: productData.categoryIds.map((categoryId) => ({
                    id: categoryId,
                })),
            };

            console.log(
                "📤 Enviando producto:",
                JSON.stringify(request, null, 2)
            );

            const response = await createAuthenticatedRequest(
                ENDPOINTS.PRODUCTS,
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );

            const apiProduct = await response.json();
            console.log("✅ Producto creado exitosamente:", apiProduct);

            // Adaptar respuesta al formato frontend
            return {
                id: apiProduct.id,
                name: apiProduct.nombre,
                description: apiProduct.descripcion,
                price: Number(apiProduct.precio),
                img: apiProduct.imagen ? [apiProduct.imagen] : [],
                categories: apiProduct.categorias || [],
                vendedor: {
                    id: vendorId,
                    name: apiProduct.vendedor?.nombre || "Mi Tienda",
                    img: apiProduct.vendedor?.imagen || "",
                },
                municipality: {
                    id: 1,
                    nombre: "Sin especificar",
                    provincia: "Málaga",
                },
            };
        } catch (error: any) {
            console.error("❌ Error creando producto:", error);
            throw new Error(error.message || "Error al crear el producto");
        } finally {
            isCreatingProduct = false;
        }
    },

    /**
     * Actualiza un producto existente
     */
    async updateProduct(
        id: number,
        productData: ProductFormData
    ): Promise<ProductInterface> {
        if (isUpdatingProduct[id]) {
            throw new Error("Ya se está actualizando este producto");
        }

        try {
            isUpdatingProduct[id] = true;

            const vendorId = await getCurrentVendorId();

            const request = {
                id,
                nombre: productData.name.trim(),
                descripcion: productData.description.trim(),
                precio: Number(productData.price),
                imagen: productData.imagen || "",
                vendedor: {
                    id: vendorId,
                },
                categorias: productData.categoryIds.map((categoryId) => ({
                    id: categoryId,
                })),
            };

            console.log(
                "📤 Actualizando producto:",
                JSON.stringify(request, null, 2)
            );

            const response = await createAuthenticatedRequest(
                `${ENDPOINTS.PRODUCTS}/${id}`,
                {
                    method: "PUT",
                    body: JSON.stringify(request),
                }
            );

            const apiProduct = await response.json();

            return {
                id: apiProduct.id,
                name: apiProduct.nombre,
                description: apiProduct.descripcion,
                price: Number(apiProduct.precio),
                img: apiProduct.imagen ? [apiProduct.imagen] : [],
                categories: apiProduct.categorias || [],
                vendedor: {
                    id: vendorId,
                    name: apiProduct.vendedor?.nombre || "Mi Tienda",
                    img: apiProduct.vendedor?.imagen || "",
                },
                municipality: {
                    id: 1,
                    nombre: "Sin especificar",
                    provincia: "Málaga",
                },
            };
        } catch (error: any) {
            console.error("❌ Error actualizando producto:", error);
            throw new Error(error.message || "Error al actualizar el producto");
        } finally {
            isUpdatingProduct[id] = false;
        }
    },

    /**
     * Elimina un producto
     */
    async deleteProduct(id: number): Promise<void> {
        if (isDeletingProduct[id]) {
            return;
        }

        try {
            isDeletingProduct[id] = true;

            await createAuthenticatedRequest(`${ENDPOINTS.PRODUCTS}/${id}`, {
                method: "DELETE",
            });

            console.log("✅ Producto eliminado exitosamente");
        } catch (error: any) {
            console.error("❌ Error eliminando producto:", error);
            throw new Error(error.message || "Error al eliminar el producto");
        } finally {
            isDeletingProduct[id] = false;
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

    createEmptyProductForm(): ProductFormData {
        return {
            name: "",
            description: "",
            price: 0,
            imagen: "",
            categoryIds: [],
        };
    },

    async checkVendorPermissions(): Promise<boolean> {
        try {
            await getCurrentVendorId();
            return true;
        } catch {
            return false;
        }
    },
};

export default vendorProductsService;
