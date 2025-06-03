// src/pages/home/index.tsx

import { useEffect, useState, useCallback } from "react";
import mercadilloService from "../../services";
import {
    type CategoryInterface,
    type ProductInterface,
} from "../../types/types";

import { Footer, Header, ProductList, CategoryList } from "../../componentes";
import MunicipioIndicator from "../../componentes/municipioIndicator";

import classes from "./home.module.css";

function Home() {
    // ============ ESTADO LOCAL ============
    const [categoriasPrincipales, setCategoriasPrincipales] = useState<
        CategoryInterface[]
    >([]);
    const [productosPopulares, setProductosPopulares] = useState<
        ProductInterface[]
    >([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(false); // Cambiado: no carga inmediatamente
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const [productsError, setProductsError] = useState<string | null>(null);
    const [pageReady, setPageReady] = useState(false);

    // ============ CARGA PROGRESIVA ============
    useEffect(() => {
        const loadCriticalData = async () => {
            try {
                setCategoriesLoading(true);
                setCategoriesError(null);

                // Solo cargar categorías principales inicialmente
                const allCategories = await mercadilloService.getCategories();
                const mainCategories = allCategories.filter(
                    (cat) => !cat.fatherId
                );

                setCategoriasPrincipales(mainCategories);
                setPageReady(true); // Página lista para mostrar

                // Cargar productos después de un pequeño delay para no bloquear la UI
                setTimeout(() => {
                    loadPopularProducts();
                }, 100);
            } catch (err: any) {
                setCategoriesError(err.message || "Error al cargar categorías");
                setPageReady(true); // Mostrar página incluso con error
            } finally {
                setCategoriesLoading(false);
            }
        };

        loadCriticalData();
    }, []);

    const loadPopularProducts = useCallback(async () => {
        try {
            setProductsLoading(true);
            setProductsError(null);

            const allProducts = await mercadilloService.getProducts();
            const popularProducts = allProducts.slice(0, 6);
            setProductosPopulares(popularProducts);
        } catch (err: any) {
            setProductsError(
                err.message || "Error al cargar productos populares"
            );
        } finally {
            setProductsLoading(false);
        }
    }, []);

    // ============ HANDLERS ============
    const handleCategoriesRetry = useCallback(() => {
        setCategoriesError(null);
        setCategoriesLoading(true);

        mercadilloService
            .getCategories()
            .then((allCategories) => {
                const mainCategories = allCategories.filter(
                    (cat) => !cat.fatherId
                );
                setCategoriasPrincipales(mainCategories);
            })
            .catch((err) =>
                setCategoriesError(err.message || "Error al cargar categorías")
            )
            .finally(() => setCategoriesLoading(false));
    }, []);

    const handleProductsRetry = useCallback(() => {
        loadPopularProducts();
    }, [loadPopularProducts]);

    const handleAddToCart = useCallback((product: ProductInterface) => {
        console.log("Producto añadido desde Home:", product.name);
    }, []);

    // ============ EARLY RETURN SI NO ESTÁ LISTO ============
    if (!pageReady) {
        return (
            <div className={classes.home}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loadingState}>
                        <div className={classes.loadingSpinner}></div>
                        <p>Cargando Mercadillo Local...</p>
                    </div>
                </div>
            </div>
        );
    }

    // ============ RENDER ============
    return (
        <div className={classes.home}>
            <Header />

            <div className={classes.container}>
                <main className={classes.main}>
                    {/* Sección de bienvenida con indicador de municipio */}
                    <div className={classes.welcomeSection}>
                        <h1 className={classes.welcomeTitle}>
                            Bienvenido a Mercadillo Local
                        </h1>
                        <p className={classes.welcomeSubtitle}>
                            Explora productos y tiendas cerca de ti
                        </p>

                        {/* Indicador de municipio en banner */}
                        <MunicipioIndicator
                            style="banner"
                            size="large"
                            showChangeButton={true}
                        />
                    </div>

                    {/* Sección de categorías principales */}
                    <section className={classes.categoriesSection}>
                        <div className={classes.sectionHeader}>
                            <h2 className={classes.sectionTitle}>
                                Categorías Principales
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                Encuentra productos organizados por categorías
                            </p>
                        </div>

                        <CategoryList
                            categories={categoriasPrincipales}
                            loading={categoriesLoading}
                            error={categoriesError}
                            onRetry={handleCategoriesRetry}
                            showSubcategories={false}
                        />
                    </section>

                    {/* Sección de productos más vendidos - Carga después */}
                    <section className={classes.popularProductsSection}>
                        <div className={classes.sectionHeader}>
                            <h2 className={classes.sectionTitle}>
                                Productos Más Vendidos
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                Los favoritos de tu zona
                            </p>
                        </div>

                        {!productsLoading &&
                        productosPopulares.length === 0 &&
                        !productsError ? (
                            // Placeholder mientras carga
                            <div className={classes.productsPlaceholder}>
                                <div className={classes.placeholderGrid}>
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={classes.placeholderCard}
                                        >
                                            <div
                                                className={
                                                    classes.placeholderImage
                                                }
                                            ></div>
                                            <div
                                                className={
                                                    classes.placeholderText
                                                }
                                            ></div>
                                            <div
                                                className={
                                                    classes.placeholderPrice
                                                }
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <ProductList
                                products={productosPopulares}
                                loading={productsLoading}
                                error={productsError}
                                onAddToCart={handleAddToCart}
                                onRetry={handleProductsRetry}
                            />
                        )}
                    </section>
                </main>
            </div>

            <div className={classes.spacer}></div>
            <Footer />
        </div>
    );
}

export default Home;
