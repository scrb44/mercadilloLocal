// src/pages/home/index.tsx - SOLO CATEGORÍAS PRINCIPALES Y PRODUCTOS MÁS VENDIDOS
import { useEffect, useState, useCallback } from "react";
import mercadilloService from "../../services";
import {
    type CategoryInterface,
    type ProductInterface,
} from "../../types/types";

import Footer from "../../componentes/footer";
import Header from "../../componentes/header";
import ProductList from "../../componentes/productList";
import CategoryList from "../../componentes/categoryList";

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
    const [productsLoading, setProductsLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const [productsError, setProductsError] = useState<string | null>(null);

    // ============ CARGAR DATOS ============
    useEffect(() => {
        const loadData = async () => {
            // Cargar categorías y productos en paralelo
            const loadCategories = async () => {
                try {
                    setCategoriesLoading(true);
                    setCategoriesError(null);
                    const allCategories =
                        await mercadilloService.getCategories();

                    // Filtrar solo las categorías principales (sin fatherId)
                    const mainCategories = allCategories.filter(
                        (cat) => !cat.fatherId
                    );
                    setCategoriasPrincipales(mainCategories);
                } catch (err: any) {
                    setCategoriesError(
                        err.message || "Error al cargar categorías"
                    );
                } finally {
                    setCategoriesLoading(false);
                }
            };

            const loadPopularProducts = async () => {
                try {
                    setProductsLoading(true);
                    setProductsError(null);
                    // Obtenemos todos los productos y tomamos los primeros 6 como "más vendidos"
                    const allProducts = await mercadilloService.getProducts();
                    // Los primeros 6 productos del mockData son los "más vendidos"
                    const popularProducts = allProducts.slice(0, 6);
                    setProductosPopulares(popularProducts);
                } catch (err: any) {
                    setProductsError(
                        err.message || "Error al cargar productos populares"
                    );
                } finally {
                    setProductsLoading(false);
                }
            };

            // Ejecutar ambas cargas en paralelo
            await Promise.all([loadCategories(), loadPopularProducts()]);
        };

        loadData();
    }, []);

    // ============ HANDLERS ============
    const handleCategoriesRetry = useCallback(() => {
        setCategoriesError(null);
        setCategoriesLoading(true);

        mercadilloService
            .getCategories()
            .then((allCategories) => {
                // Filtrar solo categorías principales
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
        setProductsError(null);
        setProductsLoading(true);

        mercadilloService
            .getProducts()
            .then((allProducts) => {
                const popularProducts = allProducts.slice(0, 6);
                setProductosPopulares(popularProducts);
            })
            .catch((err) =>
                setProductsError(
                    err.message || "Error al cargar productos populares"
                )
            )
            .finally(() => setProductsLoading(false));
    }, []);

    const handleAddToCart = useCallback((product: ProductInterface) => {
        console.log("Producto añadido desde Home:", product.name);
    }, []);

    // ============ RENDER ============
    return (
        <div className={classes.home}>
            <Header />

            <div className={classes.container}>
                <main className={classes.main}>
                    {/* Sección de bienvenida */}
                    <div className={classes.welcomeSection}>
                        <h1 className={classes.welcomeTitle}>
                            Bienvenido a Mercadillo Local
                        </h1>
                        <p className={classes.welcomeSubtitle}>
                            Explora nuestras categorías principales y descubre
                            los productos más vendidos
                        </p>
                    </div>

                    {/* Sección de categorías principales */}
                    <section className={classes.categoriesSection}>
                        <div className={classes.sectionHeader}>
                            <h2 className={classes.sectionTitle}>
                                Categorías Principales
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                Navega por nuestras categorías principales para
                                encontrar lo que buscas
                            </p>
                        </div>

                        <CategoryList
                            categories={categoriasPrincipales}
                            loading={categoriesLoading}
                            error={categoriesError}
                            onRetry={handleCategoriesRetry}
                            showSubcategories={false} // Explícitamente NO mostrar subcategorías
                        />
                    </section>

                    {/* Sección de productos más vendidos */}
                    <section className={classes.popularProductsSection}>
                        <div className={classes.sectionHeader}>
                            <h2 className={classes.sectionTitle}>
                                Productos Más Vendidos
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                Descubre los productos favoritos de nuestra
                                comunidad
                            </p>
                        </div>

                        <ProductList
                            products={productosPopulares}
                            loading={productsLoading}
                            error={productsError}
                            onAddToCart={handleAddToCart}
                            onRetry={handleProductsRetry}
                        />
                    </section>
                </main>
            </div>

            <div className={classes.spacer}></div>
            <Footer />
        </div>
    );
}

export default Home;
