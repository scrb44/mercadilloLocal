// src/pages/home/index.tsx - SIN FLASH/REPINTADO

import { useEffect, useState, useCallback, useRef } from "react";
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
    const [productsLoading, setProductsLoading] = useState(false);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);
    const [productsError, setProductsError] = useState<string | null>(null);

    // Estados para evitar flash
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const hasInitialized = useRef(false);

    // ============ CARGA INICIAL SIN FLASH ============
    useEffect(() => {
        // Evitar doble ejecución en modo desarrollo
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const loadInitialData = async () => {
            try {
                setCategoriesLoading(true);
                setCategoriesError(null);

                // Cargar categorías principales
                const allCategories = await mercadilloService.getCategories();
                const mainCategories = allCategories.filter(
                    (cat) => !cat.fatherId
                );

                // Actualizar estado de una vez para evitar re-renders
                setCategoriasPrincipales(mainCategories);
                setCategoriesLoading(false);
                setInitialLoadComplete(true);

                // Pequeño delay antes de mostrar productos para suavizar la transición
                setTimeout(() => {
                    setShowProducts(true);
                    loadPopularProducts();
                }, 200);
            } catch (err: any) {
                setCategoriesError(err.message || "Error al cargar categorías");
                setCategoriesLoading(false);
                setInitialLoadComplete(true);
            }
        };

        loadInitialData();
    }, []); // Sin dependencias para evitar re-ejecuciones

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

    // ============ RENDER CON FADE-IN PROGRESIVO ============
    return (
        <div className={classes.home}>
            <Header />

            <div className={classes.container}>
                <main className={classes.main}>
                    {/* Sección de bienvenida - siempre visible */}
                    <div className={`${classes.welcomeSection} ${classes.fadeInInitial}`}>
    <div className={classes.welcomeContent}>
        <div className={classes.welcomeText}>
            <h1 className={classes.welcomeTitle}>
                Bienvenido a Mercadillo Local
            </h1>
            <p className={classes.welcomeSubtitle}>
                Explora productos y tiendas cerca de ti
            </p>

            <MunicipioIndicator
                style="banner"
                size="large"
                showChangeButton={true}
            />
        </div>

        <div className={classes.welcomeImageWrapper}>
            <img
                src="https://sh-assets.holidu.com/imagecache/blog-photos/16902_Fill_670_0.jpg"
                alt="Mercado local"
                className={classes.welcomeImage}
            />
        </div>
    </div>
</div>


                    <section
    className={`${classes.categoriesSection} ${
        initialLoadComplete ? classes.fadeInCategories : classes.hidden
    }`}
>
    <div className={classes.sectionHeader}>
        <h2 className={classes.sectionTitle}>Categorías Principales</h2>
        <p className={classes.sectionSubtitle}>
            Encuentra productos organizados por categorías
        </p>
    </div>

    <div className={classes.horizontalScroll}>
        {categoriasPrincipales.map((categoria) => (
            <CategoryList
                key={categoria.id}
                categories={[categoria]} // individual
                loading={false}
                error={null}
                onRetry={() => {}}
                showSubcategories={false}
            />
        ))}
    </div>
</section>


                    {/* Sección de productos - fade in progresivo */}
                    <section
                        className={`${classes.popularProductsSection} ${
                            showProducts
                                ? classes.fadeInProducts
                                : classes.hidden
                        }`}
                    >
                        <div className={classes.sectionHeader}>
                            <h2 className={classes.sectionTitle}>
                                Productos Más Vendidos
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                Los favoritos de tu zona
                            </p>
                        </div>

                        {/* Mostrar placeholder solo si no hay productos y no hay error */}
                        {!productsLoading &&
                        productosPopulares.length === 0 &&
                        !productsError ? (
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
