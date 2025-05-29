// src/types/apiTypes.ts - ACTUALIZADO con estructura real de categorías

// ============ INTERFACES DE LA API REAL ============

export interface ApiProduct {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
}

// NUEVA: Estructura real que devuelve la API de categorías
export interface ApiCategory {
    id: number;
    nombre: string;
    imagen: string | null;
    categoriaPadre: ApiCategory | null; // Referencia a categoría padre
    productos: ApiProduct[]; // ¡Incluye productos!
    subcategorias: ApiCategory[]; // ¡Incluye subcategorías!
}

export interface ApiVendor {
    id: number;
    nombre: string;
    // Agregar campos reales de la API cuando los conozcas
    // email?: string;
    // telefono?: string;
    // imagen?: string;
}

export interface ApiCart {
    id?: number;
    usuarioId: string | number;
    productos: ApiCartItem[];
    // fechaActualizacion?: string;
    // total?: number;
}

export interface ApiCartItem {
    // Estructura que devuelve la API real para items del carrito
    productoId: number;
    cantidad: number;
    // producto?: ApiProduct; // Si la API incluye el producto completo
}

// ============ RESPUESTAS DE LA API ============

export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

export interface ApiListResponse<T> {
    data: T[];
    total: number;
    page?: number;
    limit?: number;
}

// ============ ERRORES DE LA API ============

export interface ApiErrorResponse {
    success: false;
    message: string;
    code?: string;
    details?: any;
}
