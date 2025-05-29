// src/hooks/index.ts - Hooks personalizados COMPLETOS

import { useState, useEffect, useCallback } from "react";
import mercadilloService from "../services";
import { type CategoryInterface, type ProductInterface } from "../types/types";

// Hook para cargar una categoría con sus datos relacionados
export function useCategory(categoryId: string | undefined) {
    const [categoria, setCategoria] = useState<CategoryInterface | null>(null);
    const [categoriaPadre, setCategoriaPadre] =
        useState<CategoryInterface | null>(null);
    const [subcategorias, setSubcategorias] = useState<CategoryInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategory = useCallback(async () => {
        if (!categoryId) return;

        try {
            setLoading(true);
            setError(null);

            const [categoryData, allCategories] = await Promise.all([
                mercadilloService.getCategory(parseInt(categoryId)),
                mercadilloService.getCategories(),
            ]);

            setCategoria(categoryData);

            // Buscar categoría padre si existe
            if (categoryData.fatherId) {
                const parentCategory = allCategories.find(
                    (cat) => cat.id === categoryData.fatherId
                );
                setCategoriaPadre(parentCategory || null);
            } else {
                setCategoriaPadre(null);
            }

            // Buscar subcategorías
            const subcategoriasDeEstaCategoria = allCategories.filter(
                (cat) => cat.fatherId === categoryData.id
            );
            setSubcategorias(subcategoriasDeEstaCategoria);
        } catch (err: any) {
            setError(err.message || "Error al cargar categoría");
        } finally {
            setLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        loadCategory();
    }, [loadCategory]);

    const retry = useCallback(() => {
        loadCategory();
    }, [loadCategory]);

    return {
        categoria,
        categoriaPadre,
        subcategorias,
        loading,
        error,
        retry,
    };
}

// Hook para cargar productos con filtros
export function useProducts(categoryId?: string, searchQuery?: string) {
    const [productos, setProductos] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProducts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const filters: any = {};
            if (categoryId) filters.category = parseInt(categoryId);
            if (searchQuery) filters.query = searchQuery;

            const productsData = await mercadilloService.getProducts(filters);
            setProductos(productsData);
        } catch (err: any) {
            setError(err.message || "Error al cargar productos");
        } finally {
            setLoading(false);
        }
    }, [categoryId, searchQuery]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const retry = useCallback(() => {
        loadProducts();
    }, [loadProducts]);

    return {
        productos,
        loading,
        error,
        retry,
    };
}

// Hook para cargar un producto individual
export function useProduct(productId: string | undefined) {
    const [producto, setProducto] = useState<ProductInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadProduct = useCallback(async () => {
        if (!productId) return;

        try {
            setLoading(true);
            setError(null);

            const data = await mercadilloService.getProduct(
                parseInt(productId)
            );
            setProducto(data);
        } catch (err: any) {
            setError(err.message || "Error al cargar el producto");
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        loadProduct();
    }, [loadProduct]);

    const retry = useCallback(() => {
        loadProduct();
    }, [loadProduct]);

    return {
        producto,
        loading,
        error,
        retry,
    };
}

// Hook para manejar formularios con validación
export function useForm<T extends Record<string, any>>(
    initialValues: T,
    validationRules?: Partial<Record<keyof T, (value: any) => string | null>>
) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleChange = useCallback(
        (name: keyof T, value: any) => {
            setValues((prev) => ({ ...prev, [name]: value }));

            // Limpiar error del campo cuando cambia
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: undefined }));
            }
        },
        [errors]
    );

    const validate = useCallback(() => {
        if (!validationRules) return true;

        const newErrors: Partial<Record<keyof T, string>> = {};
        let isValid = true;

        Object.entries(validationRules).forEach(([field, rule]) => {
            if (typeof rule === "function") {
                const error = rule(values[field as keyof T]);
                if (error) {
                    newErrors[field as keyof T] = error;
                    isValid = false;
                }
            }
        });

        setErrors(newErrors);
        return isValid;
    }, [values, validationRules]);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
    }, [initialValues]);

    return {
        values,
        errors,
        handleChange,
        validate,
        reset,
        setErrors,
    };
}
