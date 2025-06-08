// src/services/pedidosService.ts - Servicio para gestión de pedidos en el frontend
import { API_BASE_URL } from "../constants";

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
            const response = await createAuthenticatedRequest(
                "/api/pedidos/crear",
                {
                    method: "POST",
                    body: JSON.stringify(request),
                }
            );

            const data = await response.json();
            return data.pedido;
        } catch (error: any) {
            console.error("❌ Error creando pedido:", error);
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
     * Obtener estadísticas de pedidos
     */
    async obtenerEstadisticas(): Promise<EstadisticasPedidos> {
        try {
            const response = await createAuthenticatedRequest(
                "/api/pedidos/estadisticas"
            );
            const data = await response.json();

            return data.estadisticas;
        } catch (error: any) {
            console.error("❌ Error obteniendo estadísticas:", error);
            throw new Error(
                error.message || "Error al obtener las estadísticas"
            );
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
     * Parsear productos del JSON
     */
    parsearProductos(productosJson: string): ProductoPedido[] {
        try {
            return JSON.parse(productosJson);
        } catch (error) {
            console.error("Error parseando productos JSON:", error);
            return [];
        }
    },

    /**
     * Formatear fecha para mostrar
     */
    formatearFecha(fechaString: string): string {
        try {
            const fecha = new Date(fechaString);
            return fecha.toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return fechaString;
        }
    },

    /**
     * Formatear precio
     */
    formatearPrecio(precio: number): string {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(precio);
    },
};
