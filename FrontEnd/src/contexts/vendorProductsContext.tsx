// src/contexts/vendorProductsContext.tsx - Contexto para gestión de productos

import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    type ReactNode,
} from "react";
import {
    type VendorProductsState,
    type VendorProductsContextType,
    type ProductInterface,
    type ProductFormData,
    type VendorProductAction,
} from "../types/types";
import { vendorProductsService } from "../services/vendorProductServices"; // Importación corregida

// ============ ESTADO INICIAL ============

const initialState: VendorProductsState = {
    products: [],
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
};

// ============ REDUCER ============

function vendorProductsReducer(
    state: VendorProductsState,
    action: VendorProductAction
): VendorProductsState {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload, error: null };

        case "SET_CREATING":
            return { ...state, creating: action.payload, error: null };

        case "SET_UPDATING":
            return { ...state, updating: action.payload, error: null };

        case "SET_DELETING":
            return { ...state, deleting: action.payload, error: null };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
                loading: false,
                creating: false,
                updating: false,
                deleting: false,
            };

        case "LOAD_PRODUCTS_SUCCESS":
            return {
                ...state,
                products: action.payload,
                loading: false,
                error: null,
            };

        case "CREATE_PRODUCT_SUCCESS":
            return {
                ...state,
                products: [...state.products, action.payload],
                creating: false,
                error: null,
            };

        case "UPDATE_PRODUCT_SUCCESS":
            return {
                ...state,
                products: state.products.map((product) =>
                    product.id === action.payload.id ? action.payload : product
                ),
                updating: false,
                error: null,
            };

        case "DELETE_PRODUCT_SUCCESS":
            return {
                ...state,
                products: state.products.filter(
                    (product) => product.id !== action.payload
                ),
                deleting: false,
                error: null,
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

// ============ CONTEXT ============

const VendorProductsContext = createContext<
    VendorProductsContextType | undefined
>(undefined);

// ============ PROVIDER ============

interface VendorProductsProviderProps {
    children: ReactNode;
}

export const VendorProductsProvider: React.FC<VendorProductsProviderProps> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(vendorProductsReducer, initialState);

    // ============ CARGAR PRODUCTOS ============

    const loadProducts = useCallback(async () => {
        dispatch({ type: "SET_LOADING", payload: true });

        try {
            const products = await vendorProductsService.getVendorProducts();
            dispatch({ type: "LOAD_PRODUCTS_SUCCESS", payload: products });
        } catch (error: any) {
            dispatch({
                type: "SET_ERROR",
                payload: error.message || "Error al cargar productos",
            });
        }
    }, []);

    // ============ CREAR PRODUCTO ============

    const createProduct = useCallback(
        async (productData: ProductFormData): Promise<void> => {
            // Prevenir llamadas duplicadas
            if (state.creating) {
                return; // Cambiado: no lanzar error, solo return
            }

            // Validar datos antes de enviar
            const validation =
                vendorProductsService.validateProductData(productData);
            if (!validation.valid) {
                const errorMessage = validation.errors.join(", ");
                dispatch({
                    type: "SET_ERROR",
                    payload: errorMessage,
                });
                return; // Cambiado: no lanzar error, solo return
            }

            dispatch({ type: "SET_CREATING", payload: true });

            try {
                const newProduct = await vendorProductsService.createProduct(
                    productData
                );
                dispatch({
                    type: "CREATE_PRODUCT_SUCCESS",
                    payload: newProduct,
                });
                // No retornamos el producto, solo void
            } catch (error: any) {
                const errorMessage = error.message || "Error al crear producto";
                dispatch({
                    type: "SET_ERROR",
                    payload: errorMessage,
                });
                // No re-lanzamos el error para mantener la signatura Promise<void>
            }
        },
        [state.creating]
    );

    // ============ ACTUALIZAR PRODUCTO ============

    const updateProduct = useCallback(
        async (id: number, productData: ProductFormData) => {
            // Validar datos antes de enviar
            const validation =
                vendorProductsService.validateProductData(productData);
            if (!validation.valid) {
                dispatch({
                    type: "SET_ERROR",
                    payload: validation.errors.join(", "),
                });
                return;
            }

            dispatch({ type: "SET_UPDATING", payload: true });

            try {
                const updatedProduct =
                    await vendorProductsService.updateProduct(id, productData);
                dispatch({
                    type: "UPDATE_PRODUCT_SUCCESS",
                    payload: updatedProduct,
                });
            } catch (error: any) {
                dispatch({
                    type: "SET_ERROR",
                    payload: error.message || "Error al actualizar producto",
                });
            }
        },
        []
    );

    // ============ ELIMINAR PRODUCTO ============

    const deleteProduct = useCallback(async (id: number) => {
        dispatch({ type: "SET_DELETING", payload: true });

        try {
            await vendorProductsService.deleteProduct(id);
            dispatch({ type: "DELETE_PRODUCT_SUCCESS", payload: id });
        } catch (error: any) {
            dispatch({
                type: "SET_ERROR",
                payload: error.message || "Error al eliminar producto",
            });
        }
    }, []);

    // ============ UTILIDADES ============

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: "SET_ERROR", payload: error });
    }, []);

    // ============ VALOR DEL CONTEXTO ============

    const contextValue: VendorProductsContextType = {
        state,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        reset,
        setError,
    };

    return (
        <VendorProductsContext.Provider value={contextValue}>
            {children}
        </VendorProductsContext.Provider>
    );
};

// ============ HOOK ============

export const useVendorProducts = (): VendorProductsContextType => {
    const context = useContext(VendorProductsContext);
    if (context === undefined) {
        throw new Error(
            "useVendorProducts must be used within a VendorProductsProvider"
        );
    }
    return context;
};

export default VendorProductsContext;
