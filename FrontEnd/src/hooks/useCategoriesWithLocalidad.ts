// src/hooks/useCategoriesWithLocalidad.ts - Hook para categorías con filtro de localidad

import { useState, useEffect, useCallback } from "react";
import { categoryService } from "../services/categoriesService";
import { useMunicipio } from "../contexts/municipioContext";
import { type CategoryInterface } from "../types/types";

export interface UseCategoriesWithLocalidadReturn {
    categorias: CategoryInterface[];
    loading: boolean;
    error: string | null;
    retry: () => void;
    loadCategoriesByLocalidad: (localidadId: number) => Promise<void>;
    loadAllCategories: () => Promise<void>;
    currentLocalidad: number | null;
}

/**
 * Hook para gestionar el estado de categorías en formularios o selectores
 */
export function useCategorySelector() {
    const { categorias, loading, error } = useCategoriesWithLocalidad();
    const [selectedCategory, setSelectedCategory] =
        useState<CategoryInterface | null>(null);

    const selectCategory = useCallback(
        (categoria: CategoryInterface | null) => {
            setSelectedCategory(categoria);
        },
        []
    );

    const clearSelection = useCallback(() => {
        setSelectedCategory(null);
    }, []);

    return {
        categorias,
        loading,
        error,
        selectedCategory,
        selectCategory,
        clearSelection,
        hasSelection: selectedCategory !== null,
    };
}

export function useCurrentLocalidadCategories(): UseCategoriesWithLocalidadReturn {
    return useCategoriesWithLocalidad();
}

/**
 * Hook para obtener una categoría específica por ID
 */
export function useCategoryById(categoryId: number | null) {
    const [categoria, setCategoria] = useState<CategoryInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadCategory = useCallback(async (id: number) => {
        try {
            setLoading(true);
            setError(null);

            const categoriaResult = await categoryService.getCategoryById(id);
            setCategoria(categoriaResult);
        } catch (err: any) {
            console.error(`❌ Error cargando categoría ${id}:`, err);
            setError(err.message || "Error al cargar la categoría");
            setCategoria(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (categoryId) {
            loadCategory(categoryId);
        } else {
            setCategoria(null);
        }
    }, [categoryId, loadCategory]);

    return {
        categoria,
        loading,
        error,
        retry: () => categoryId && loadCategory(categoryId),
    };
}

/**
 * Hook personalizado para manejar categorías con filtro de localidad automático
 */
export function useCategoriesWithLocalidad(): UseCategoriesWithLocalidadReturn {
    const { municipio } = useMunicipio();

    const [categorias, setCategorias] = useState<CategoryInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentLocalidad, setCurrentLocalidad] = useState<number | null>(
        null
    );

    /**
     * Carga categorías para una localidad específica
     */
    const loadCategoriesByLocalidad = useCallback(
        async (localidadId: number) => {
            try {
                setLoading(true);
                setError(null);

                const categoriasResult =
                    await categoryService.getCategoriesByLocalidad(localidadId);

                setCategorias(categoriasResult);
                setCurrentLocalidad(localidadId);
            } catch (err: any) {
                console.error(
                    "❌ Error cargando categorías por localidad:",
                    err
                );
                setError(err.message || "Error al cargar las categorías");
                setCategorias([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Carga todas las categorías (sin filtro de localidad)
     */
    const loadAllCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const categoriasResult = await categoryService.getAllCategories();

            setCategorias(categoriasResult);
            setCurrentLocalidad(null);
        } catch (err: any) {
            console.error("❌ Error cargando todas las categorías:", err);
            setError(err.message || "Error al cargar las categorías");
            setCategorias([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Función de reintento que usa la localidad actual
     */
    const retry = useCallback(() => {
        if (municipio?.id) {
            loadCategoriesByLocalidad(municipio.id);
        } else {
            loadAllCategories();
        }
    }, [municipio?.id, loadCategoriesByLocalidad, loadAllCategories]);

    /**
     * Efecto para cargar categorías cuando cambia la localidad seleccionada
     */
    useEffect(() => {
        if (municipio?.id) {
            loadCategoriesByLocalidad(municipio.id);
        } else {
            // Si no hay municipio seleccionado, cargar todas las categorías
            loadAllCategories();
        }
    }, [municipio?.id, loadCategoriesByLocalidad, loadAllCategories]);

    return {
        categorias,
        loading,
        error,
        retry,
        loadCategoriesByLocalidad,
        loadAllCategories,
        currentLocalidad,
    };
}
