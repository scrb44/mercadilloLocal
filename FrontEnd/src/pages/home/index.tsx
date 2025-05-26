import React, { useEffect, useState, useCallback } from "react";
import { useUser, useCart } from "../../contexts";
import mercadilloService from "../../services";
import {
    type ProductInterface,
    type SearchFiltersInterface,
} from "../../types/types";

import Filter from "../../componentes/filter";
import Footer from "../../componentes/footer";
import Header from "../../componentes/header";

import classes from "./home.module.css";

function Home() {
    const [productos, setProductos] = useState<ProductInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ USAR VALORES PRIMITIVOS EN LUGAR DE OBJETOS
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<
        number | undefined
    >();

    const { user, isAuthenticated } = useUser();
    const cart = isAuthenticated ? useCart() : null;

    // ✅ CARGAR PRODUCTOS - Dependencias específicas
    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);

                // Construir filtros aquí
                const filters: SearchFiltersInterface = {};
                if (searchQuery) filters.query = searchQuery;
                if (selectedCategory) filters.category = selectedCategory;

                const data = await mercadilloService.getProducts(filters);
                setProductos(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [searchQuery, selectedCategory]); // ← Dependencias primitivas específicas

    // ✅ HANDLER ESTABLE CON useCallback
    const handleFiltersChange = useCallback(
        (newFilters: SearchFiltersInterface) => {
            setSearchQuery(newFilters.query || "");
            setSelectedCategory(newFilters.category);
        },
        []
    );

    const handleAddToCart = async (product: ProductInterface) => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir productos al carrito");
            return;
        }

        if (!cart) return;

        try {
            await cart.addItem(product, 1);
            console.log("✅ Producto añadido al carrito:", product.name);
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            alert("Error al añadir producto al carrito");
        }
    };

    return (
        <div className={classes["home"]}>
            <Header />
            <Filter onFiltersChange={handleFiltersChange} />

            <main>
                {loading && <p>Cargando productos...</p>}

                {error && (
                    <div
                        style={{
                            backgroundColor: "#fee2e2",
                            padding: "10px",
                            margin: "10px",
                        }}
                    >
                        <p style={{ color: "#dc2626" }}>❌ {error}</p>
                    </div>
                )}

                {!loading && !error && (
                    <div className={classes["productos-lista"]}>
                        {productos.length === 0 ? (
                            <p>📦 No se encontraron productos</p>
                        ) : (
                            productos.map((producto) => (
                                <div
                                    key={producto.id}
                                    className={classes["producto"]}
                                >
                                    <img
                                        src={producto.img[0]}
                                        alt={producto.name}
                                        width={150}
                                        style={{ borderRadius: "8px" }}
                                    />
                                    <h3>{producto.name}</h3>
                                    <p>{producto.description}</p>
                                    <p
                                        style={{
                                            fontWeight: "bold",
                                            color: "#2563eb",
                                        }}
                                    >
                                        €{producto.price}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "0.9em",
                                            color: "#666",
                                        }}
                                    >
                                        Vendedor: {producto.vendedor.name}
                                    </p>

                                    <button
                                        onClick={() =>
                                            handleAddToCart(producto)
                                        }
                                        disabled={cart?.loading}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: isAuthenticated
                                                ? "#2563eb"
                                                : "#6b7280",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer",
                                            marginTop: "10px",
                                        }}
                                    >
                                        {isAuthenticated
                                            ? "Añadir al carrito"
                                            : "Inicia sesión"}
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );

export default Home;
