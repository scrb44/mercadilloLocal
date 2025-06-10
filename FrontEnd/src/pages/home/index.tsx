// src/pages/home/index.tsx - ACTUALIZADO con filtro de localidad

import { useEffect, useState, useCallback, useRef } from "react";
import { categoryService } from "../../services/categoriesService";
import { productsService } from "../../services/productService";
import { useMunicipio } from "../../contexts/municipioContext";
import {
    type CategoryInterface,
    type ProductInterface,
} from "../../types/types";

import { Footer, Header, ProductList, CategoryList } from "../../componentes";
import MunicipioIndicator from "../../componentes/municipioIndicator";

import classes from "./home.module.css";

function Home() {
    // ============ HOOKS ============
    const { municipio } = useMunicipio();

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

    // ============ CARGA DE CATEGORÍAS CON LOCALIDAD ============
    const loadCategories = useCallback(async () => {
        try {
            setCategoriesLoading(true);
            setCategoriesError(null);

            let allCategories: CategoryInterface[];

            // Si hay municipio seleccionado, usar filtro de localidad
            if (municipio?.id) {
                allCategories = await categoryService.getCategoriesByLocalidad(
                    municipio.id
                );
            } else {
                allCategories = await categoryService.getAllCategories();
            }

            // Filtrar solo categorías principales (sin padre)
            const mainCategories = allCategories.filter((cat) => !cat.fatherId);

            setCategoriasPrincipales(mainCategories);
        } catch (err: any) {
            console.error("❌ Error cargando categorías:", err);
            setCategoriesError(err.message || "Error al cargar categorías");
        } finally {
            setCategoriesLoading(false);
        }
    }, [municipio?.id, municipio?.nombre]);

    // ============ CARGA DE PRODUCTOS CON LOCALIDAD ============
    const loadPopularProducts = useCallback(async () => {
        try {
            setProductsLoading(true);
            setProductsError(null);

            let allProducts: ProductInterface[];

            // Si hay municipio seleccionado, usar filtro de localidad
            if (municipio?.id) {
                allProducts = await productsService.getProductsByLocalidad(
                    municipio.id
                );
            } else {
                allProducts = await productsService.getProducts();
            }

            // Tomar los primeros 6 como "populares"
            const popularProducts = allProducts.slice(0, 6);
            setProductosPopulares(popularProducts);
        } catch (err: any) {
            console.error("❌ Error cargando productos:", err);
            setProductsError(
                err.message || "Error al cargar productos populares"
            );
        } finally {
            setProductsLoading(false);
        }
    }, [municipio?.id, municipio?.nombre]);

    // ============ CARGA INICIAL ============
    useEffect(() => {
        // Resetear el flag cuando cambia el municipio
        hasInitialized.current = false;
        setInitialLoadComplete(false);
        setShowProducts(false);
    }, [municipio?.id]);

    useEffect(() => {
        // Evitar doble ejecución en modo desarrollo
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const loadInitialData = async () => {
            // Cargar categorías primero
            await loadCategories();
            setInitialLoadComplete(true);

            // Pequeño delay antes de mostrar productos para suavizar la transición
            setTimeout(() => {
                setShowProducts(true);
                loadPopularProducts();
            }, 200);
        };

        loadInitialData();
    }, [loadCategories, loadPopularProducts]);

    // ============ HANDLERS ============
    const handleCategoriesRetry = useCallback(() => {
        loadCategories();
    }, [loadCategories]);

    const handleProductsRetry = useCallback(() => {
        loadPopularProducts();
    }, [loadPopularProducts]);

    const handleAddToCart = useCallback((product: ProductInterface) => {
        // TODO: Implementar añadir al carrito
    }, []);

    // ============ RENDER CON INFORMACIÓN DE LOCALIDAD ============
    return (
        <div className={classes.home}>
            <Header />
            <section className={classes.heroSection}>
                <div className={classes.heroBackground}>
                    <img
                        src="https://imagenes.20minutos.es/files/image_1920_1080/uploads/imagenes/2023/10/31/calle-larios-malaga.jpeg"
                        alt="Mercado local"
                        className={classes.heroImage}
                    />
                    <div className={classes.heroOverlay}></div>
                </div>

                <div className={classes.heroContent}>
                    <h1 className={classes.heroTitle}>
                        {municipio
                            ? `Bienvenido a Mercadillo Local en ${municipio.nombre}`
                            : "Bienvenido a Mercadillo Local"}
                    </h1>
                    <p className={classes.heroSubtitle}>
                        {municipio
                            ? `Explora productos y tiendas de ${municipio.nombre}, ${municipio.provincia}`
                            : "Selecciona tu municipio para ver productos cerca de ti"}
                    </p>

                    <MunicipioIndicator
                        style="banner"
                        size="large"
                        showChangeButton={true}
                    />
                </div>
            </section>
            <div className={classes.container}>
                <main className={classes.main}>
                    {/* Sección de bienvenida - siempre visible */}

                    {/* Sección de categorías */}
                    <section
                        className={`${classes.categoriesSection} ${
                            initialLoadComplete
                                ? classes.fadeInCategories
                                : classes.hidden
                        }`}
                    >
                        <div className={classes.sectionHeader}>
                            <h2 className={classes.sectionTitle}>
                                {municipio
                                    ? `Categorías en ${municipio.nombre}`
                                    : "Categorías Principales"}
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                {municipio
                                    ? `Encuentra productos disponibles en ${municipio.nombre}`
                                    : "Encuentra productos organizados por categorías"}
                            </p>
                        </div>

                        {categoriesError ? (
                            <div className={classes.errorState}>
                                <p>❌ {categoriesError}</p>
                                <button onClick={handleCategoriesRetry}>
                                    Reintentar
                                </button>
                            </div>
                        ) : categoriesLoading ? (
                            <div className={classes.loadingState}>
                                <p>Cargando categorías...</p>
                            </div>
                        ) : categoriasPrincipales.length === 0 ? (
                            <div className={classes.emptyState}>
                                <p>
                                    {municipio
                                        ? `No hay categorías disponibles en ${municipio.nombre}`
                                        : "No hay categorías disponibles"}
                                </p>
                                {municipio && (
                                    <p className={classes.emptyStateHint}>
                                        Intenta seleccionar otro municipio o
                                        verifica que haya productos en esta
                                        zona.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <CategoryList
                                categories={categoriasPrincipales}
                                loading={categoriesLoading}
                                error={categoriesError}
                                onRetry={handleCategoriesRetry}
                                horizontal={true}
                            />
                        )}
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
                                {municipio
                                    ? `Productos Destacados en ${municipio.nombre}`
                                    : "Productos Más Vendidos"}
                            </h2>
                            <p className={classes.sectionSubtitle}>
                                {municipio
                                    ? `Los favoritos de ${municipio.nombre}`
                                    : "Los favoritos de tu zona"}
                            </p>
                        </div>

                        {/* Info sobre la localidad */}
                        {municipio && (
                            <div className={classes.localidadInfo}>
                                <div className={classes.localidadBadge}>
                                    📍 Mostrando productos de {municipio.nombre}
                                    , {municipio.provincia}
                                </div>
                            </div>
                        )}

                        {/* Estados de productos */}
                        {productsError ? (
                            <div className={classes.errorState}>
                                <p>❌ {productsError}</p>
                                <button onClick={handleProductsRetry}>
                                    Reintentar
                                </button>
                            </div>
                        ) : !productsLoading &&
                          productosPopulares.length === 0 &&
                          !productsError ? (
                            <div className={classes.emptyState}>
                                <p>
                                    {municipio
                                        ? `No hay productos disponibles en ${municipio.nombre}`
                                        : "No hay productos disponibles"}
                                </p>
                                {municipio && (
                                    <p className={classes.emptyStateHint}>
                                        Intenta seleccionar otro municipio o
                                        verifica que haya vendedores en esta
                                        zona.
                                    </p>
                                )}
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
