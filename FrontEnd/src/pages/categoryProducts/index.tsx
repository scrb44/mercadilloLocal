// src/pages/categoryProducts/index.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import mercadilloService from "../../services";
import {
    type ProductInterface,
    type CategoryInterface,
    type SearchFiltersInterface,
} from "../../types/types";

import Filter from "../../componentes/filter";
import Footer from "../../componentes/footer";
import Header from "../../componentes/header";
import ProductList from "../../componentes/productList";

import classes from "./CategoryProducts.module.css";

function CategoryProducts() {
    const { categoryId } = useParams<{ categoryId: string }>();

    // ============ ESTADO LOCAL ============
    const [productos, setProductos] = useState<ProductInterface[]>([]);
    const [categoria, setCategoria] = useState<CategoryInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    // ============ CARGAR DATOS ============
    useEffect(() => {
        if (!categoryId) return;

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Cargar categoría y productos en paralelo
                const [categoryData, productsData] = await Promise.all([
                    mercadilloService.getCategory(parseInt(categoryId)),
                    mercadilloService.getProducts({
                        category: parseInt(categoryId),
                        query: searchQuery || undefined,
                    }),
                ]);

                setCategoria(categoryData);
                setProductos(productsData);
            } catch (err: any) {
                setError(err.message || "Error al cargar datos");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [categoryId, searchQuery]);

    // ============ HANDLERS ============
    const handleFiltersChange = useCallback(
        (newFilters: SearchFiltersInterface) => {
            setSearchQuery(newFilters.query || "");
        },
        []
    );

    const handleAddToCart = useCallback((product: ProductInterface) => {
        console.log("Producto añadido desde CategoryProducts:", product.name);
    }, []);

    const handleRetry = useCallback(() => {
        if (!categoryId) return;

        setError(null);
        setLoading(true);

        Promise.all([
            mercadilloService.getCategory(parseInt(categoryId)),
            mercadilloService.getProducts({
                category: parseInt(categoryId),
                query: searchQuery || undefined,
            }),
        ])
            .then(([categoryData, productsData]) => {
                setCategoria(categoryData);
                setProductos(productsData);
            })
            .catch((err) => setError(err.message || "Error al cargar datos"))
            .finally(() => setLoading(false));
    }, [categoryId, searchQuery]);

    // ============ RENDER ============
    if (!categoryId) {
        return (
            <div className={classes.categoryProducts}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <p>ID de categoría no válido</p>
                        <Link to="/" className={classes.backLink}>
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={classes.categoryProducts}>
            <Header />

            <div className={classes.container}>
                {/* Breadcrumb y título */}
                <div className={classes.breadcrumb}>
                    <Link to="/" className={classes.breadcrumbLink}>
                        Inicio
                    </Link>
                    <span className={classes.breadcrumbSeparator}>›</span>
                    <span className={classes.breadcrumbCurrent}>
                        {categoria?.name || "Cargando..."}
                    </span>
                </div>

                {categoria && (
                    <div className={classes.categoryHeader}>
                        <h1 className={classes.categoryTitle}>
                            {categoria.name}
                        </h1>
                        <p className={classes.categorySubtitle}>
                            Productos en la categoría {categoria.name}
                        </p>
                    </div>
                )}

                {/* Filtro de búsqueda dentro de la categoría */}
                <Filter onFiltersChange={handleFiltersChange} />

                <main className={classes.main}>
                    <ProductList
                        products={productos}
                        loading={loading}
                        error={error}
                        onAddToCart={handleAddToCart}
                        onRetry={handleRetry}
                    />
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default CategoryProducts;
