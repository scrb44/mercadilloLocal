// src/services/cartService.ts - CORREGIDO para usar JWT y endpoints del backend real
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";
import { type CartInterface, type CartItemInterface } from "../types/types";
import { adaptAndConsolidateCartResponse } from "../adapters/cartResponseAdapter";

const apiClient = createApiClient();

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
        : `http://localhost:8080${endpoint}`;

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            let errorMessage = `Error HTTP: ${response.status}`;

            try {
                const errorBody = await response.clone().text();
                if (errorBody) {
                    try {
                        const errorJson = JSON.parse(errorBody);
                        if (errorJson.message || errorJson.mensaje) {
                            errorMessage =
                                errorJson.message || errorJson.mensaje;
                        }
                    } catch {
                        if (errorBody.length < 200) {
                            errorMessage = errorBody;
                        }
                    }
                }
            } catch (e) {
                // Ignore error parsing
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

export const cartService = {
    /**
     * Obtiene el carrito del usuario autenticado
     */
    async getCart(userId: string | number): Promise<CartInterface> {
        try {
            const response = await createAuthenticatedRequest(ENDPOINTS.CART);
            const cartData = await response.json();

            // Usar el adaptador específico para respuestas del carrito
            const adaptedCart = adaptAndConsolidateCartResponse(cartData);

            return adaptedCart;
        } catch (error: any) {
            // Retornar carrito vacío en caso de error (mejor UX)
            return {
                userId,
                products: [],
                updatedAt: new Date().toISOString(),
            };
        }
    },

    /**
     * Añade un producto al carrito
     */
    async addToCart(
        userId: string | number,
        productId: number,
        quantity: number = 1
    ): Promise<CartInterface> {
        try {
            const requestBody = {
                productoId: productId,
                quantity: quantity,
            };

            const response = await createAuthenticatedRequest(
                `${ENDPOINTS.CART}/add`,
                {
                    method: "POST",
                    body: JSON.stringify(requestBody),
                }
            );

            const cartData = await response.json();

            // Usar adaptador específico
            const adaptedCart = adaptAndConsolidateCartResponse(cartData);

            return adaptedCart;
        } catch (error: any) {
            throw new Error(
                error.message || "Error al añadir producto al carrito"
            );
        }
    },

    /**
     * Elimina un producto del carrito
     */
    async removeFromCart(
        userId: string | number,
        productId: number
    ): Promise<CartInterface> {
        try {
            const response = await createAuthenticatedRequest(
                `${ENDPOINTS.CART}/remove/${productId}`,
                {
                    method: "DELETE",
                }
            );

            const cartData = await response.json();

            // Usar adaptador específico
            const adaptedCart = adaptAndConsolidateCartResponse(cartData);

            return adaptedCart;
        } catch (error: any) {
            throw new Error(
                error.message || "Error al eliminar producto del carrito"
            );
        }
    },

    /**
     * Actualiza la cantidad de un producto en el carrito
     */
    async updateCartQuantity(
        userId: string | number,
        productId: number,
        quantity: number
    ): Promise<CartInterface> {
        if (quantity <= 0) {
            return this.removeFromCart(userId, productId);
        }

        try {
            const requestBody = {
                productoId: productId,
                quantity: quantity,
            };

            const response = await createAuthenticatedRequest(
                `${ENDPOINTS.CART}/update`,
                {
                    method: "PUT",
                    body: JSON.stringify(requestBody),
                }
            );

            const cartData = await response.json();

            // Usar adaptador específico
            const adaptedCart = adaptAndConsolidateCartResponse(cartData);

            return adaptedCart;
        } catch (error: any) {
            throw new Error(error.message || "Error al actualizar cantidad");
        }
    },

    /**
     * Vacía el carrito completamente
     */
    async clearCart(userId: string | number): Promise<void> {
        try {
            await createAuthenticatedRequest(ENDPOINTS.CART, {
                method: "DELETE",
            });
        } catch (error: any) {
            throw new Error(error.message || "Error al vaciar el carrito");
        }
    },

    /**
     * Limpia el cache local (para cuando se cierre sesión)
     */
    clearLocalCache(): void {
        // No hay cache local persistente en esta implementación
        // pero dejamos el método para compatibilidad
    },
};
