// src/services/pedidosService.ts - Servicio completo para gestión de pedidos

import { ENDPOINTS } from "../constants";

const API_BASE_URL = "http://localhost:8080";

// Función helper para crear requests autenticados con debugging
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

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            let errorMessage = `Error HTTP: ${response.status}`;
            let errorDetails = null;

            try {
                const errorBody = await response.clone().text();

                if (errorBody) {
                    try {
                        const errorJson = JSON.parse(errorBody);
                        if (errorJson.message || errorJson.mensaje) {
                            errorMessage =
                                errorJson.message || errorJson.mensaje;
                        }
                        errorDetails = errorJson;
                    } catch {
                        if (errorBody.length < 200) {
                            errorMessage = errorBody;
                        }
                    }
                }
            } catch (e) {}

            console.error("❌ API Error:", {
                status: response.status,
                statusText: response.statusText,
                errorMessage,
                errorDetails,
            });

            if (response.status === 401) {
                localStorage.removeItem("token");
                throw new Error(
                    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
                );
            }
            if (response.status === 403) {
                throw new Error(
                    "No tienes permisos para realizar esta acción. Verifica que estés logueado como comprador."
                );
            }

            throw new Error(errorMessage);
        }

        return response;
    } catch (error: any) {
        console.error("❌ Network Error:", error);
        if (error.name === "TypeError" && error.message.includes("fetch")) {
            throw new Error("Error de conexión. Verifica tu internet.");
        }
        throw error;
    }
}

// Tipos para pedidos
export interface PedidoAPI {
    id: number;
    numeroPedido: string;
    fechaPedido: string;
    total: number;
    tipoComprador: string;
    compradorId: number;
    compradorNombre: string;
    compradorEmail: string;
    direccionEntrega?: string;
    ciudadEntrega?: string;
    codigoPostalEntrega?: string;
    telefonoEntrega?: string;
    cantidadProductos: number;
    productosJson: string;
    estadoPago: string;
}

export interface ProductoPedido {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen?: string;
}

export interface CrearPedidoRequest {
    total: number;
    tipoComprador: string;
    compradorId: number;
    compradorNombre: string;
    compradorEmail: string;
    cantidadProductos: number;
    direccionEntrega?: string;
    ciudadEntrega?: string;
    codigoPostalEntrega?: string;
    telefonoEntrega?: string;
    productos: ProductoPedido[];
}

export interface EstadisticasPedidos {
    totalPedidos: number;
    pedidosPagados: number;
    totalGastado: number;
}

export const pedidosService = {
    /**
     * Crear un pedido (simular pago)
     */
    async crearPedido(request: CrearPedidoRequest): Promise<PedidoAPI> {
        try {
            // ✅ VALIDACIONES DE TIPOS
            if (
                !request.compradorEmail ||
                typeof request.compradorEmail !== "string"
            ) {
                throw new Error(
                    `compradorEmail debe ser un string válido: ${request.compradorEmail}`
                );
            }

            if (
                !request.tipoComprador ||
                typeof request.tipoComprador !== "string"
            ) {
                throw new Error(
                    `tipoComprador debe ser un string válido: ${request.tipoComprador}`
                );
            }

            if (!request.productos || request.productos.length === 0) {
                throw new Error("No hay productos en el pedido");
            }

            // ✅ ASEGURAR TIPOS CORRECTOS
            const requestConTiposCorrectos = {
                ...request,
                compradorId: request.compradorId || 0, // Temporal por compatibilidad
                total: Number(request.total),
                cantidadProductos: Number(request.cantidadProductos),
            };

            const response = await createAuthenticatedRequest(
                "/api/pedidos/crear",
                {
                    method: "POST",
                    body: JSON.stringify(requestConTiposCorrectos),
                }
            );

            const data = await response.json();

            return data.pedido;
        } catch (error: any) {
            console.error("❌ Error creando pedido:", {
                message: error.message,
                request,
                stack: error.stack,
            });
            throw new Error(error.message || "Error al crear el pedido");
        }
    },

    /**
     * Obtener historial completo de pedidos
     */
    async obtenerHistorial(): Promise<PedidoAPI[]> {
        try {
            const response = await createAuthenticatedRequest(
                "/api/pedidos/historial"
            );
            const data = await response.json();

            return data.pedidos || [];
        } catch (error: any) {
            console.error("❌ Error obteniendo historial:", error);
            throw new Error(error.message || "Error al obtener el historial");
        }
    },

    /**
     * Obtener pedidos recientes (últimos 30 días)
     */
    async obtenerPedidosRecientes(): Promise<PedidoAPI[]> {
        try {
            const response = await createAuthenticatedRequest(
                "/api/pedidos/recientes"
            );
            const data = await response.json();

            return data.pedidos || [];
        } catch (error: any) {
            console.error("❌ Error obteniendo pedidos recientes:", error);
            throw new Error(
                error.message || "Error al obtener los pedidos recientes"
            );
        }
    },

    /**
     * Obtener solo pedidos pagados
     */
    async obtenerPedidosPagados(): Promise<PedidoAPI[]> {
        try {
            const response = await createAuthenticatedRequest(
                "/api/pedidos/pagados"
            );
            const data = await response.json();

            return data.pedidos || [];
        } catch (error: any) {
            console.error("❌ Error obteniendo pedidos pagados:", error);
            throw new Error(
                error.message || "Error al obtener los pedidos pagados"
            );
        }
    },

    /**
     * Obtener pedido por ID
     */
    async obtenerPedidoPorId(pedidoId: number): Promise<PedidoAPI> {
        try {
            const response = await createAuthenticatedRequest(
                `/api/pedidos/${pedidoId}`
            );
            const data = await response.json();

            return data.pedido;
        } catch (error: any) {
            console.error("❌ Error obteniendo pedido:", error);
            throw new Error(error.message || "Error al obtener el pedido");
        }
    },

    /**
     * Buscar pedido por número
     */
    async buscarPorNumero(numeroPedido: string): Promise<PedidoAPI> {
        try {
            const response = await createAuthenticatedRequest(
                `/api/pedidos/buscar/${numeroPedido}`
            );
            const data = await response.json();

            return data.pedido;
        } catch (error: any) {
            console.error("❌ Error buscando pedido:", error);
            throw new Error(error.message || "Error al buscar el pedido");
        }
    },

    /**
     * Obtener estadísticas de pedidos
     */
    async obtenerEstadisticas(): Promise<EstadisticasPedidos> {
        try {
            const response = await createAuthenticatedRequest(
                "/api/pedidos/estadisticas"
            );
            const data = await response.json();

            return data.estadisticas || data; // Compatibilidad con diferentes respuestas del backend
        } catch (error: any) {
            console.error("❌ Error obteniendo estadísticas:", error);
            throw new Error(
                error.message || "Error al obtener las estadísticas"
            );
        }
    },

    /**
     * Parsear productos del JSON
     */
    parsearProductos(productosJson: string): ProductoPedido[] {
        try {
            if (!productosJson || productosJson.trim() === "") {
                console.warn("🔧 JSON de productos vacío o inválido");
                return [];
            }
            return JSON.parse(productosJson);
        } catch (error) {
            console.error("❌ Error parseando productos JSON:", error);
            return [];
        }
    },

    /**
     * Formatear fecha para mostrar
     */
    formatearFecha(fechaString: string): string {
        try {
            if (!fechaString) {
                return "Fecha no disponible";
            }

            const fecha = new Date(fechaString);

            // Verificar si la fecha es válida
            if (isNaN(fecha.getTime())) {
                console.warn("🔧 Fecha inválida:", fechaString);
                return fechaString;
            }

            return fecha.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            console.error("❌ Error formateando fecha:", error);
            return fechaString || "Fecha no disponible";
        }
    },

    /**
     * Formatear precio
     */
    formatearPrecio(precio: number | string): string {
        try {
            const precioNumerico =
                typeof precio === "string" ? parseFloat(precio) : precio;

            if (isNaN(precioNumerico)) {
                console.warn("🔧 Precio inválido:", precio);
                return "0,00 €";
            }

            return new Intl.NumberFormat("es-ES", {
                style: "currency",
                currency: "EUR",
            }).format(precioNumerico);
        } catch (error) {
            console.error("❌ Error formateando precio:", error);
            return "0,00 €";
        }
    },

    /**
     * Función de debug para verificar token
     */
    async debugToken(): Promise<any> {
        try {
            const token = localStorage.getItem("token");

            if (token) {
                // Intentar decodificar el payload (no verificar firma, solo leer)
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    return payload;
                } catch (e) {
                    console.warn("❌ No se pudo decodificar el token:", e);
                }
            }

            return null;
        } catch (error) {
            console.error("❌ Error en debug token:", error);
            return null;
        }
    },
};
