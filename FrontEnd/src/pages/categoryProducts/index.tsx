// src/pages/categoryProducts/index.tsx - VERSIÓN SIMPLIFICADA
import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    type SearchFiltersInterface,
    type ProductInterface,
} from "../../types/types";

// Hooks personalizados
import { useCategory, useProducts } from "../../hooks";

// Componentes
import {
    Filter,
    Footer,
    Header,
    CategoryList,
    CategoryHeader,
    ProductsSection,
} from "../../componentes";

import classes from "./CategoryProducts.module.css";

function CategoryProducts() {
    const { categoryId } = useParams<{ categoryId: string }>();

    // 🔧 SIMPLIFICADO: Solo mantenemos query para el hook original
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [additionalFilters, setAdditionalFilters] =
        useState<SearchFiltersInterface>({});

    // Usar hooks personalizados
    const {
        categoria,
        categoriaPadre,
        subcategorias,
        loading: categoryLoading,
        error: categoryError,
        retry: retryCategory,
    } = useCategory(categoryId);

    // 🔧 USAR HOOK ORIGINAL: Solo con query para que funcione automáticamente
    const {
        productos: allProducts,
        loading: productsLoading,
        error: productsError,
        retry: retryProducts,
    } = useProducts(categoryId, searchQuery);

    // 🔧 FILTRAR LOCALMENTE: Aplicar filtros adicionales después
    const productos = useMemo(() => {
        let filteredProducts = [...allProducts];

        // Filtrar por precio mínimo
        if (additionalFilters.minPrice && additionalFilters.minPrice > 0) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price >= additionalFilters.minPrice!
            );
        }

        // Filtrar por precio máximo
        if (additionalFilters.maxPrice && additionalFilters.maxPrice > 0) {
            filteredProducts = filteredProducts.filter(
                (product) => product.price <= additionalFilters.maxPrice!
            );
        }

        // Filtrar por nombre de vendedor
        if (
            additionalFilters.vendorName &&
            additionalFilters.vendorName.trim()
        ) {
            const vendorQuery = additionalFilters.vendorName.toLowerCase();
            filteredProducts = filteredProducts.filter((product) => {
                const vendorName =
                    product.vendedor?.name?.toLowerCase() ||
                    product.vendedor?.nombre?.toLowerCase() ||
                    "";
                return vendorName.includes(vendorQuery);
            });
        }
        return filteredProducts;
    }, [allProducts, additionalFilters]);

    // ============ HANDLERS ============
    const handleFiltersChange = useCallback(
        (newFilters: SearchFiltersInterface) => {
            // Separar query de otros filtros
            const { query, ...otherFilters } = newFilters;

            // Query va directo al hook para búsqueda automática
            if (query !== searchQuery) {
                setSearchQuery(query || "");
            }

            // Otros filtros se aplican localmente
            setAdditionalFilters(otherFilters);
        },
        [searchQuery]
    );

    const handleAddToCart = useCallback((product: any) => {}, []);

    const handleClearSearch = useCallback(() => {
        setSearchQuery("");
        setAdditionalFilters({});
    }, []);

    const handleRetry = useCallback(() => {
        retryCategory();
        retryProducts();
    }, [retryCategory, retryProducts]);

    // ============ RENDER CONDICIONAL PARA ERRORES ============
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

    // ============ RENDER PRINCIPAL ============
    return (
        <div className={classes.categoryProducts}>
            <Header />

            <div className={classes.container}>
                {/* Header de categoría */}
                {categoria && (
                    <CategoryHeader
                        categoria={categoria}
                        categoriaPadre={categoriaPadre}
                        productCount={productos.length}
                        subcategoryCount={subcategorias.length}
                    />
                )}

                {/* Subcategorías (solo si existen y no hay búsqueda activa) */}
                {subcategorias.length > 0 && !searchQuery && (
                    <div className={classes.subcategoriesSection}>
                        <div className={classes.subcategoriesHeader}>
                            <h2 className={classes.subcategoriesTitle}>
                                Explora las subcategorías de {categoria?.name}
                            </h2>
                            <p className={classes.subcategoriesSubtitle}>
                                Encuentra productos más específicos navegando
                                por las subcategorías
                            </p>
                        </div>
                        <CategoryList
                            categories={subcategorias}
                            loading={false}
                            error={null}
                            horizontal={false}
                        />
                    </div>
                )}

                {/* Filtro de búsqueda */}
                <Filter onFiltersChange={handleFiltersChange} />

                <main className={classes.main}>
                    {/* Sección de productos */}
                    {categoria && (
                        <ProductsSection
                            products={productos}
                            categoria={categoria}
                            searchQuery={searchQuery}
                            loading={productsLoading}
                            error={productsError}
                            onAddToCart={handleAddToCart}
                            onRetry={handleRetry}
                            onClearSearch={handleClearSearch}
                        />
                    )}

                    {/* Mensaje si no hay productos pero sí subcategorías */}
                    {!productsLoading &&
                        productos.length === 0 &&
                        subcategorias.length > 0 &&
                        !searchQuery && (
                            <div className={classes.noProductsButSubcategories}>
                                <div className={classes.noProductsContent}>
                                    <span className={classes.infoIcon}>💡</span>
                                    <h3 className={classes.infoTitle}>
                                        Esta categoría contiene subcategorías
                                    </h3>
                                    <p className={classes.infoText}>
                                        Los productos están organizados en las
                                        subcategorías mostradas arriba. Explora
                                        las subcategorías para encontrar lo que
                                        buscas.
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* Footer de navegación */}
                    {categoria && !categoryLoading && (
                        <div className={classes.navigationFooter}>
                            <div className={classes.backNavigation}>
                                {categoriaPadre ? (
                                    <Link
                                        to={`/categoria/${categoriaPadre.id}`}
                                        className={classes.backToParentLink}
                                    >
                                        ← Volver a {categoriaPadre.name}
                                    </Link>
                                ) : (
                                    <Link
                                        to="/"
                                        className={classes.backToHomeLink}
                                    >
                                        ← Volver al inicio
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default CategoryProducts;
