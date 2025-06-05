// src/services/index.ts
import { productsService } from "./productService";
import { categoriesService } from "./categoryService";
import { cartService } from "./cartService";
import { createApiClient } from "./api";

// Objeto principal que combina todos los servicios
export const mercadilloService = {
    // Productos
    getProduct: productsService.getProduct,
    getProductById: productsService.getProduct, // Alias para consistencia
    getProducts: productsService.getProducts,
    searchProducts: productsService.searchProducts,

    // Categorías
    getCategory: categoriesService.getCategory,
    getCategories: categoriesService.getCategories,

    // Carrito
    getCart: cartService.getCart,
    addToCart: cartService.addToCart,
    removeFromCart: cartService.removeFromCart,
    updateCartQuantity: cartService.updateCartQuantity,
    clearCart: cartService.clearCart,

    // Utilidades
    cancelRequests: () => {
        const client = createApiClient();
        client.abort();
    },
    clearLocalCache: cartService.clearLocalCache,
};

// Exportar servicios individuales por si alguien los quiere usar por separado
export { productsService } from "./productService";
export { categoriesService } from "./categoryService";
export { cartService } from "./cartService";

// Exportar por defecto el servicio principal
export default mercadilloService;
