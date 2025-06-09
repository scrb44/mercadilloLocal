// src/constants/index.ts - Constantes de la aplicación COMPLETO

// URLs y endpoints - EXACTOS según el backend Spring Boot
export const API_BASE_URL = "http://localhost:8080";

export const ENDPOINTS = {
    PRODUCTS: "/api/producto",
    CATEGORIES: "/api/categoria",
    VENDORS: "/api/vendedor", // CORREGIDO: era "vendedores" pero el backend usa "vendedor"
    CART: "/api/carrito", // EXACTO según CarritoController
    AUTH: "/api/auth",
    USER: "/api/usuario",
    PAYMENTS: "/api/payments", // Para futuro uso
    PEDIDOS: "/api/pedidos", // ✅ NUEVO: Para gestión de pedidos
    LOCALIDADES: "/api/localidad/con-vendedores",
} as const;

// Rutas de la aplicación
export const ROUTES = {
    HOME: "/",
    WHO_WE_ARE: "/quienes-somos",
    MUNICIPALITY_SELECTOR: "/seleccionar-municipio",
    LOGIN: "/login",
    REGISTER: "/registro",
    CART: "/carrito",
    CATEGORY: "/categoria",
    PRODUCT: "/producto",
    PROFILE: "/perfil",
    ORDERS: "/pedidos",
    MIS_COMPRAS: "/mis-compras", // ✅ NUEVO: Ruta para historial de compras
    CHECKOUT: "/checkout",
    PAYMENT: "/pago",
    PAYMENT_CONFIRMATION: "/pago/confirmacion",

    // Rutas de vendedores
    VENDOR_PRODUCTS: "/mis-productos",
    CREATE_PRODUCT: "/subir-producto",
    EDIT_PRODUCT: "/editar-producto",
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

// Mensajes de error - ACTUALIZADOS
export const ERROR_MESSAGES = {
    GENERIC: "Ha ocurrido un error inesperado",
    NETWORK: "Error de conexión. Verifica tu internet",
    UNAUTHORIZED: "Debes iniciar sesión para continuar",
    SESSION_EXPIRED: "Tu sesión ha expirado. Inicia sesión nuevamente",
    FORBIDDEN: "No tienes permisos para realizar esta acción",
    NOT_FOUND: "El recurso solicitado no fue encontrado",
    VALIDATION: "Los datos ingresados no son válidos",
    SERVER: "Error en el servidor. Intenta más tarde",
    VENDOR_ONLY: "Solo los vendedores pueden acceder a esta página",

    // Errores específicos del carrito
    CART_LOAD_ERROR: "Error al cargar el carrito",
    CART_ADD_ERROR: "Error al añadir producto al carrito",
    CART_REMOVE_ERROR: "Error al eliminar producto del carrito",
    CART_UPDATE_ERROR: "Error al actualizar cantidad",
    CART_CLEAR_ERROR: "Error al vaciar el carrito",

    // ✅ NUEVOS: Errores específicos de pedidos
    ORDER_CREATE_ERROR: "Error al crear el pedido",
    ORDER_LOAD_ERROR: "Error al cargar pedidos",
    ORDER_NOT_FOUND: "Pedido no encontrado",
} as const;

// Mensajes de éxito - ACTUALIZADOS
export const SUCCESS_MESSAGES = {
    PRODUCT_ADDED: "Producto añadido al carrito",
    PRODUCT_REMOVED: "Producto eliminado del carrito",
    CART_CLEARED: "Carrito vaciado correctamente",
    LOGIN_SUCCESS: "Sesión iniciada correctamente",
    REGISTER_SUCCESS: "Cuenta creada exitosamente",
    PROFILE_UPDATED: "Perfil actualizado correctamente",
    PRODUCT_CREATED: "Producto creado exitosamente",
    PRODUCT_UPDATED: "Producto actualizado correctamente",
    PRODUCT_DELETED: "Producto eliminado correctamente",
    QUANTITY_UPDATED: "Cantidad actualizada correctamente",

    // ✅ NUEVOS: Mensajes de éxito para pedidos
    ORDER_CREATED: "¡Pedido realizado exitosamente!",
    PAYMENT_SUCCESS: "Pago procesado correctamente",
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

// Roles de usuario - EXACTOS según el backend
export const USER_ROLES = {
    COMPRADOR: "COMPRADOR", // EXACTO según backend
    VENDEDOR: "VENDEDOR", // EXACTO según backend
    ADMIN: "ADMIN", // EXACTO según backend
} as const;

// Estados de pedido
export const ORDER_STATUS = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",

    // ✅ NUEVOS: Estados específicos de pago
    PAGADO: "PAGADO",
    PENDIENTE: "PENDIENTE",
    FALLIDO: "FALLIDO",
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

// Configuración de productos - AJUSTADA según backend
export const PRODUCT_CONFIG = {
    MIN_PRICE: 0.01,
    MAX_PRICE: 99999.99,
    MAX_IMAGES: 10,
    MAX_NAME_LENGTH: 100, // Según campo 'nombre' en Producto.java
    MAX_DESCRIPTION_LENGTH: 1000, // Según campo 'descripcion' en Producto.java
    MIN_NAME_LENGTH: 3,
    MIN_DESCRIPTION_LENGTH: 10,
    MAX_CATEGORIES: 5,
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

// Variable con la url del placeholder
export const PlaceholderURL =
    "https://dn721900.ca.archive.org/0/items/placeholder-image_202006/placeholder-image.jpg";

// Función helper para verificar si un usuario es vendedor
export const isVendor = (userRole?: string): boolean => {
    return userRole === USER_ROLES.VENDEDOR;
};

// Función helper para verificar si un usuario es comprador
export const isComprador = (userRole?: string): boolean => {
    return userRole === USER_ROLES.COMPRADOR;
};

// Función helper para verificar si un usuario es admin
export const isAdmin = (userRole?: string): boolean => {
    return userRole === USER_ROLES.ADMIN;
};

// Función helper para generar breadcrumbs dinámicos
export const generateBreadcrumbs = (currentPath: string) => {
    const pathSegments = currentPath.split("/").filter(Boolean);
    const breadcrumbs = [{ name: "Inicio", path: "/" }];

    let currentRoute = "";
    pathSegments.forEach((segment, index) => {
        currentRoute += `/${segment}`;

        // Mapear segmentos a nombres legibles
        const segmentNames: Record<string, string> = {
            "mis-productos": "Mis Productos",
            "subir-producto": "Crear Producto",
            "editar-producto": "Editar Producto",
            "mis-compras": "Mis Compras", // ✅ NUEVO
            perfil: "Mi Perfil",
            carrito: "Carrito",
            categoria: "Categoría",
            producto: "Producto",
            checkout: "Finalizar Compra",
            pago: "Pago",
            "seleccionar-municipio": "Seleccionar Municipio",
            "quienes-somos": "Quiénes Somos",
        };

        const name =
            segmentNames[segment] ||
            segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ name, path: currentRoute });
    });

    return breadcrumbs;
};
