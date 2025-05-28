// src/pages/home/Home.tsx - VERSIÓN LIMPIA
import { useEffect, useState, useCallback } from "react";
import mercadilloService from "../../services";
import {
    type ProductInterface,
    type SearchFiltersInterface,
} from "../../types/types";

import Filter from "../../componentes/filter";
import Footer from "../../componentes/footer";
import Header from "../../componentes/header";
import ProductList from "../../componentes/productList";

import classes from "./home.module.css";

function Home() {
    // ============ ESTADO LOCAL ============
    const [productos, setProductos] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<
        number | undefined
    >();

    // ============ CARGAR PRODUCTOS ============
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Construir filtros
                const filters: SearchFiltersInterface = {};
                if (searchQuery) filters.query = searchQuery;
                if (selectedCategory) filters.category = selectedCategory;

                const data = await mercadilloService.getProducts(filters);
                setProductos(data);
            } catch (err: any) {
                setError(err.message || "Error al cargar productos");
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [searchQuery, selectedCategory]);

    // ============ HANDLERS ============
    const handleFiltersChange = useCallback(
        (newFilters: SearchFiltersInterface) => {
            setSearchQuery(newFilters.query || "");
            setSelectedCategory(newFilters.category);
        },
        []
    );

    const handleAddToCart = useCallback((product: ProductInterface) => {
        // Este callback se ejecuta cuando se añade un producto al carrito
        console.log("Producto añadido desde Home:", product.name);
    }, []);

    const handleRetry = useCallback(() => {
        // Reintentar cargar productos
        const filters: SearchFiltersInterface = {};
        if (searchQuery) filters.query = searchQuery;
        if (selectedCategory) filters.category = selectedCategory;

        setError(null);
        setLoading(true);

        mercadilloService
            .getProducts(filters)
            .then(setProductos)
            .catch((err) =>
                setError(err.message || "Error al cargar productos")
            )
            .finally(() => setLoading(false));
    }, [searchQuery, selectedCategory]);

    // ============ RENDER ============
    return (
        <div className={classes.home}>
            <Header />

            <Filter onFiltersChange={handleFiltersChange} />
            <div className={classes.container}>
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

            <div className={classes.spacer}></div>
            <Footer />
        </div>
    );
}

export default Home;
