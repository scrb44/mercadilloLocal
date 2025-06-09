// src/hooks/useProductsWithLocalidad.ts - Hook para productos con filtro de localidad

import { useState, useEffect, useCallback } from "react";
import {
    productsService,
    type SearchFiltersWithLocalidad,
} from "../services/productService";
import { useMunicipio } from "../contexts/municipioContext";
import {
    type ProductInterface,
    type UseProductsWithLocalidadReturn,
    type SearchFiltersInterface,
} from "../types/types";

/**
 * Hook personalizado para manejar productos con filtro de localidad automático
 */
export function useProductsWithLocalidad(
    initialFilters?: SearchFiltersInterface
): UseProductsWithLocalidadReturn {
    const { municipio } = useMunicipio();

    const [productos, setProductos] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLocalidad, setCurrentLocalidad] = useState<number | null>(
        null
    );

    /**
     * Carga productos incluyendo automáticamente el filtro de localidad
     */
    const loadProducts = useCallback(
        async (filters?: SearchFiltersInterface, localidadId?: number) => {
            try {
                setLoading(true);
                setError(null);

                const targetLocalidad = localidadId || municipio?.id;

                if (!targetLocalidad) {
                    console.warn(
                        "⚠️ No hay localidad seleccionada para filtrar productos"
                    );
                    setProductos([]);
                    return;
                }

                const filtersWithLocalidad: SearchFiltersWithLocalidad = {
                    ...filters,
                    localidad: targetLocalidad,
                };

                const productosResult = await productsService.getProducts(
                    filtersWithLocalidad
                );

                setProductos(productosResult);
                setCurrentLocalidad(targetLocalidad);
            } catch (err: any) {
                console.error("❌ Error cargando productos:", err);
                setError(err.message || "Error al cargar los productos");
                setProductos([]);
            } finally {
                setLoading(false);
            }
        },
        [municipio?.id]
    );

    /**
     * Función específica para cargar productos por localidad
     */
    const loadProductsByLocalidad = useCallback(
        async (
            localidadId: number,
            filters?: Omit<SearchFiltersWithLocalidad, "localidad">
        ) => {
            await loadProducts(filters, localidadId);
        },
        [loadProducts]
    );

    /**
     * Función de reintento que usa los filtros actuales
     */
    const retry = useCallback(() => {
        loadProducts(initialFilters);
    }, [loadProducts, initialFilters]);

    /**
     * Efecto para cargar productos cuando cambia la localidad seleccionada
     */
    useEffect(() => {
        if (municipio?.id) {
            loadProducts(initialFilters);
        } else {
            // Si no hay municipio seleccionado, limpiar productos
            setProductos([]);
            setCurrentLocalidad(null);
        }
    }, [municipio?.id, loadProducts, initialFilters]);

    return {
        productos,
        loading,
        error,
        retry,
        loadProductsByLocalidad,
        currentLocalidad,
    };
}

/**
 * Hook simplificado para obtener productos de la localidad actual
 */
export function useCurrentLocalidadProducts(
    filters?: SearchFiltersInterface
): UseProductsWithLocalidadReturn {
    return useProductsWithLocalidad(filters);
}

/**
 * Hook para búsqueda de productos en la localidad actual
 */
export function useProductSearch() {
    const { municipio } = useMunicipio();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const searchProducts = useCallback(
        async (
            query: string,
            additionalFilters?: SearchFiltersInterface
        ): Promise<ProductInterface[]> => {
            try {
                setLoading(true);
                setError(null);

                if (!municipio?.id) {
                    throw new Error(
                        "No hay localidad seleccionada para realizar la búsqueda"
                    );
                }

                const filtersWithLocalidad: SearchFiltersWithLocalidad = {
                    ...additionalFilters,
                    query,
                    localidad: municipio.id,
                };

                const results = await productsService.getProducts(
                    filtersWithLocalidad
                );

                return results;
            } catch (err: any) {
                console.error("❌ Error en búsqueda de productos:", err);
                setError(err.message || "Error en la búsqueda");
                throw err;
            } finally {
                setLoading(false);
            }
        },
        [municipio?.id, municipio?.nombre]
    );

    return {
        searchProducts,
        loading,
        error,
    };
}
