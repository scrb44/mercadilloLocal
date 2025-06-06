// src/types/apiTypes.ts - ACTUALIZADO con nueva estructura real

// ============ INTERFACES DE LA API REAL ============

export interface ApiProduct {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number; // O BigDecimal desde Java
    imagen: string;
    categorias: ApiCategory[];
    vendedor: ApiVendedor;
}

export interface ApiProductRequest {
    id?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categorias: number[]; // Solo IDs para enviar al backend
    vendedorId?: number; // Solo ID del vendedor para enviar
}

export interface ApiVendedor {
    id: number;
    usuario: string;
    nombre: string;
    email: string;
    telf: string;
    verificado: boolean;
    imagen: string;
    localidad: ApiLocalidad;
}

export interface ApiLocalidad {
    id: number;
    nombre: string;
    provincia: string | null;
}

export interface ApiCategory {
    id: number;
    nombre: string;
    imagen: string | null;
    categoriaPadre: ApiCategory | null;
    subcategorias: ApiCategory[];
    productos?: ApiProduct[]; // Opcional, dependiendo del endpoint
}

export interface ApiCart {
    id?: number;
    usuarioId: string | number;
    productos: ApiCartItem[];
}

export interface ApiCartItem {
    productoId: number;
    cantidad: number;
}

// ============ NUEVOS: REQUESTS PARA CRUD DE PRODUCTOS ============

export interface CreateProductRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoriaIds: number[];
}

export interface UpdateProductRequest {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoriaIds: number[];
}

export interface DeleteProductRequest {
    id: number;
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

export interface ProductOperationResponse {
    success: boolean;
    message: string;
    product?: ApiProduct;
}

// ============ ERRORES DE LA API ============

export interface ApiErrorResponse {
    success: false;
    message: string;
    code?: string;
    details?: any;
}

// ============ TIPOS PARA AUTENTICACIÓN ============

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    rol: string;
    usuario: string;
    nombre: string;
    email: string;
    imagen: string;
    token: string;
    verificado?: boolean;
    localidad?: ApiLocalidad;
}

export interface RegisterRequest {
    usuario: string;
    nombre: string;
    email: string;
    password: string;
    telf: string;
    role: "comprador" | "vendedor";
}
