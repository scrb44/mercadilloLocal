// src/constants/index.ts - Constantes de la aplicación

// URLs y endpoints
export const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
    PRODUCTS: "/api/productos",
    CATEGORIES: "/api/Categoria",
    VENDORS: "/api/vendedores",
    CART: "/api/carrito",
    AUTH: "/api/auth",
    USER: "/api/usuario",
    PAYMENTS: "/api/payments", // NUEVO: Endpoints de pago
} as const;

// Rutas de la aplicación
export const ROUTES = {
    HOME: "/",
    WHO_WE_ARE: "/quienes-somos", 
    LOGIN: "/login",
    REGISTER: "/registro",
    CART: "/carrito",
    CATEGORY: "/categoria",
    PRODUCT: "/producto",
    PROFILE: "/perfil",
    ORDERS: "/pedidos",
    CHECKOUT: "/checkout", // NUEVO
    PAYMENT: "/pago", // NUEVO
    PAYMENT_CONFIRMATION: "/pago/confirmacion", // NUEVO
} as const;

// Configuración de cache
export const CACHE_CONFIG = {
    PRODUCTS_TTL: 1000 * 60 * 15, // 15 minutos
    CATEGORIES_TTL: 1000 * 60 * 60 * 2, // 2 horas
    VENDORS_TTL: 1000 * 60 * 60, // 1 hora
    SEARCH_TTL: 1000 * 60 * 5, // 5 minutos
    CART_TTL: 1000 * 60 * 60 * 24 * 30, // 30 días
} as const;

// Prefijos de cache
export const CACHE_PREFIXES = {
    PRODUCT: "mercadillo-product-",
    CATEGORY: "mercadillo-category-",
    VENDOR: "mercadillo-vendor-",
    CART: "mercadillo-cart-",
    SEARCH: "mercadillo-search-",
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
    GENERIC: "Ha ocurrido un error inesperado",
    NETWORK: "Error de conexión. Verifica tu internet",
    UNAUTHORIZED: "Debes iniciar sesión para continuar",
    NOT_FOUND: "El recurso solicitado no fue encontrado",
    VALIDATION: "Los datos ingresados no son válidos",
    SERVER: "Error en el servidor. Intenta más tarde",
} as const;

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
    PRODUCT_ADDED: "Producto añadido al carrito",
    PRODUCT_REMOVED: "Producto eliminado del carrito",
    CART_CLEARED: "Carrito vaciado correctamente",
    LOGIN_SUCCESS: "Sesión iniciada correctamente",
    REGISTER_SUCCESS: "Cuenta creada exitosamente",
    PROFILE_UPDATED: "Perfil actualizado correctamente",
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
    NAME: "Mercadillo Local",
    VERSION: "1.0.0",
    DESCRIPTION: "Tu marketplace local de confianza",
    DEFAULT_LANGUAGE: "es",
    DEFAULT_CURRENCY: "€",
    ITEMS_PER_PAGE: 12,
    MAX_CART_ITEMS: 99,
    MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
    DEBOUNCE_DELAY: 500,
} as const;

// Roles de usuario
export const USER_ROLES = {
    USER: "user",
    VENDOR: "vendor",
    ADMIN: "admin",
} as const;

// Estados de pedido
export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
} as const;

// Métodos de pago
export const PAYMENT_METHODS = {
    CARD: "card",
    PAYPAL: "paypal",
    TRANSFER: "transfer",
    CASH: "cash",
} as const;

// Configuración responsive
export const BREAKPOINTS = {
    MOBILE: 480,
    TABLET: 768,
    DESKTOP: 1024,
    LARGE: 1200,
} as const;

// Configuración de animaciones
export const ANIMATIONS = {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
} as const;

// Configuración de productos
export const PRODUCT_CONFIG = {
    MIN_PRICE: 0.01,
    MAX_PRICE: 99999.99,
    MAX_IMAGES: 10,
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 1000,
} as const;

// Patrones de validación
export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
    PHONE: /^[+]?[\s\d-()]{10,}$/,
    POSTAL_CODE: /^\d{5}$/,
} as const;

// Exportaciones agrupadas para facilitar el uso
export const Messages = {
    ...ERROR_MESSAGES,
    ...SUCCESS_MESSAGES,
};

export const Config = {
    ...APP_CONFIG,
    ...CACHE_CONFIG,
    ...PRODUCT_CONFIG,
};

export const Patterns = {
    ...VALIDATION_PATTERNS,
};

export const Status = {
    USER_ROLES,
    ORDER_STATUS,
    PAYMENT_METHODS,
};

// Función helper para construir URLs de API
export const buildApiUrl = (endpoint: string): string => {
    return `${API_BASE_URL}${endpoint}`;
};

// Función helper para construir rutas de la app
export const buildRoute = (
    route: string,
    params?: Record<string, string | number>
): string => {
    let finalRoute = route;
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            finalRoute = finalRoute.replace(`:${key}`, String(value));
        });
    }
    return finalRoute;
};
