// src/adapters/index.ts - Barrel de adaptadores

// ============ PRODUCT ADAPTERS ============
export {
    adaptApiProduct,
    adaptApiProducts,
    adaptProductToApi,
    validateApiProduct,
    adaptValidApiProducts,
} from "./productAdapter";

// ============ CATEGORY ADAPTERS ============
export {
    adaptApiCategory,
    adaptApiCategories,
    adaptCategoryToApi,
    validateApiCategory,
    adaptValidApiCategories,
    organizeHierarchicalCategories,
    flattenCategories,
    extractProductsFromCategory,
} from "./categoryAdapter";

// ============ CART ADAPTERS ============
export {
    adaptApiCart,
    adaptApiCartItems,
    adaptCartToApi,
    adaptCartItemToApi,
    validateApiCart,
    validateApiCartItem,
    createEmptyCart,
    calculateCartTotals,
} from "./cartAdapter";

// ============ CART RESPONSE ADAPTERS (NUEVO) ============
export {
    adaptCarritoResponse,
    adaptAndConsolidateCartResponse,
    consolidateCartItems,
    findCartItem,
    isProductInCart,
    getProductQuantityInCart,
} from "./cartResponseAdapter";

// ============ EXPORT TYPES ============
export type {
    ApiProduct,
    ApiCategory,
    ApiVendedor as ApiVendor,
    ApiCart,
    ApiCartItem,
    ApiResponse,
    ApiListResponse,
    ApiErrorResponse,
} from "../types/apiTypes";
