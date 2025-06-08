// src/services/index.ts - ACTUALIZADO
import { productsService } from "./productService";
import { categoryService } from "./categoriesService";
import { cartService } from "./cartService";
import { createApiClient } from "./api";

// Objeto principal que combina todos los servicios
export const mercadilloService = {
    // Productos
    getProduct: productsService.getProduct,
    getProductById: productsService.getProduct, // Alias para consistencia
    getProducts: productsService.getProducts,
    searchProducts: productsService.searchProducts,
    getProductsByLocalidad: productsService.getProductsByLocalidad,

    // Categorías
    getCategory: categoryService.getCategoryById,
    getCategoryById: categoryService.getCategoryById,
    getCategories: categoryService.getAllCategories,
    getAllCategories: categoryService.getAllCategories,
    getCategoriesByLocalidad: categoryService.getCategoriesByLocalidad,

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

// Exportar servicios individuales
export { productsService } from "./productService";
export { categoryService } from "./categoriesService";
export { cartService } from "./cartService";

// Exportar por defecto el servicio principal
export default mercadilloService;
