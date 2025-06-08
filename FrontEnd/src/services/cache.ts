interface CacheItem<T> {
    data: T;
    timestamp: number;
    ttl?: number;
}

const DEFAULT_TTL = 1000 * 60 * 30; // 30 minutos
const PRODUCTS_TTL = 1000 * 60 * 15; // 15 minutos para productos (pueden cambiar precios/stock)
const CATEGORIES_TTL = 1000 * 60 * 60 * 2; // 2 horas para categorías (cambian menos)
const VENDORS_TTL = 1000 * 60 * 60; // 1 hora para vendedores

// Prefijos para organizar el cache
const CACHE_PREFIXES = {
    PRODUCT: "mercadillo-product-",
    CATEGORY: "mercadillo-category-",
    VENDOR: "mercadillo-vendor-",
    CART: "mercadillo-cart-",
    SEARCH: "mercadillo-search-",
} as const;

function isLocalStorageAvailable(): boolean {
    try {
        const test = "__localStorage_test__";
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
}

export function getItem<T>(key: string): T | null {
    if (!isLocalStorageAvailable()) {
        console.warn("localStorage no disponible");
        return null;
    }

    try {
        const item = localStorage.getItem(key);
        if (!item) return null;

        const parsed: CacheItem<T> = JSON.parse(item);

        if (parsed.ttl && Date.now() - parsed.timestamp > parsed.ttl) {
            localStorage.removeItem(key);
            return null;
        }

        return parsed.data;
    } catch (error) {
        console.error("Error reading cache:", error);
        return null;
    }
}

export function setItem<T>(
    key: string,
    data: T,
    ttl: number = DEFAULT_TTL
): void {
    if (!isLocalStorageAvailable()) {
        console.warn("localStorage no disponible, saltando cache");
        return;
    }

    try {
        const item: CacheItem<T> = {
            data,
            timestamp: Date.now(),
            ttl,
        };
        localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
        console.error("Error writing to cache:", error);
    }
}

export function removeItem(key: string): void {
    localStorage.removeItem(key);
}

// Funciones específicas
export function cacheProduct<T>(productId: number, data: T): void {
    setItem(`${CACHE_PREFIXES.PRODUCT}${productId}`, data, PRODUCTS_TTL);
}

export function getCachedProduct<T>(productId: number): T | null {
    return getItem<T>(`${CACHE_PREFIXES.PRODUCT}${productId}`);
}

export function cacheCategory<T>(categoryId: number, data: T): void {
    setItem(`${CACHE_PREFIXES.CATEGORY}${categoryId}`, data, CATEGORIES_TTL);
}

export function getCachedCategory<T>(categoryId: number): T | null {
    return getItem<T>(`${CACHE_PREFIXES.CATEGORY}${categoryId}`);
}

export function cacheVendor<T>(vendorId: number, data: T): void {
    setItem(`${CACHE_PREFIXES.VENDOR}${vendorId}`, data, VENDORS_TTL);
}

export function getCachedVendor<T>(vendorId: number): T | null {
    return getItem<T>(`${CACHE_PREFIXES.VENDOR}${vendorId}`);
}

export function cacheSearchResults<T>(query: string, data: T): void {
    // Cache de búsquedas por menos tiempo ya que pueden cambiar rápido
    setItem(`${CACHE_PREFIXES.SEARCH}${query}`, data, 1000 * 60 * 5); // 5 minutos
}

export function getCachedSearchResults<T>(query: string): T | null {
    return getItem<T>(`${CACHE_PREFIXES.SEARCH}${query}`);
}

// Cache del carrito (sin TTL, persiste hasta que el usuario lo cambie)
export function cacheCart<T>(userId: string | number, data: T): void {
    setItem(`${CACHE_PREFIXES.CART}${userId}`, data, 1000 * 60 * 60 * 24 * 30); // 30 días
}

export function getCachedCart<T>(userId: string | number): T | null {
    return getItem<T>(`${CACHE_PREFIXES.CART}${userId}`);
}

export function clearCart(userId: string | number): void {
    removeItem(`${CACHE_PREFIXES.CART}${userId}`);
}

export function clearExpiredCache(): void {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("mercadillo-")) {
            getItem(key); // Esto automáticamente limpia los expirados
        }
    });
}

// Función para limpiar todo el cache del mercadillo
export function clearAllMercadilloCache(): void {
    Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("mercadillo-")) {
            localStorage.removeItem(key);
        }
    });
}

// En cache.ts - Agregar funciones específicas para invalidar cache de productos:

// Función para invalidar cache específico de un producto
export function invalidateProductCache(productId: number): void {
    const productKey = `${CACHE_PREFIXES.PRODUCT}${productId}`;
    removeItem(productKey);
}

// Función para invalidar todos los caches relacionados con productos
export function invalidateProductRelatedCaches(): void {
    Object.keys(localStorage).forEach((key) => {
        if (
            key.startsWith(CACHE_PREFIXES.SEARCH) ||
            key.includes("vendor-products") ||
            key.includes("category-products")
        ) {
            removeItem(key);
        }
    });
}

// Función para invalidar cache de un vendedor específico
export function invalidateVendorCache(vendorId: number): void {
    const vendorKey = `${CACHE_PREFIXES.VENDOR}${vendorId}`;
    removeItem(vendorKey);

    // También invalidar productos del vendedor
    Object.keys(localStorage).forEach((key) => {
        if (key.includes(`vendor-${vendorId}-products`)) {
            removeItem(key);
        }
    });
}

// Función para obtener versión fresca de un producto (sin cache)
export function getFreshProduct<T>(productId: number): T | null {
    // Forzar eliminación del cache antes de obtener
    invalidateProductCache(productId);
    return null; // Forzar que se obtenga desde la API
}

// Función mejorada para setear cache de producto con timestamp
export function cacheProductWithTimestamp<T>(productId: number, data: T): void {
    const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: PRODUCTS_TTL,
        version: 1, // Para futuras migraciones de cache
    };

    setItem(`${CACHE_PREFIXES.PRODUCT}${productId}`, cacheData, PRODUCTS_TTL);
}

// Función para verificar si el cache de un producto está actualizado
export function isProductCacheStale(
    productId: number,
    maxAge: number = PRODUCTS_TTL
): boolean {
    const cacheKey = `${CACHE_PREFIXES.PRODUCT}${productId}`;
    const cachedItem = localStorage.getItem(cacheKey);

    if (!cachedItem) return true;

    try {
        const parsed = JSON.parse(cachedItem);
        const age = Date.now() - parsed.timestamp;
        return age > maxAge;
    } catch {
        return true;
    }
}
