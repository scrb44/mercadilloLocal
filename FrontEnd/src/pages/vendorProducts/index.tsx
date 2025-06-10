// src/pages/vendorProducts/index.tsx - Página de gestión de productos

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts";
import { useVendorProducts } from "../../contexts/vendorProductsContext";
import { Header, Footer } from "../../componentes";
import { type ProductInterface } from "../../types/types";
import classes from "./vendorProducts.module.css";

function VendorProducts() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const { state, loadProducts, deleteProduct } = useVendorProducts();
    const [searchQuery, setSearchQuery] = useState("");
    const [editingProduct, setEditingProduct] =
        useState<ProductInterface | null>(null);

    // ============ PROTECCIÓN DE RUTA ============
    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        if (user?.role !== "VENDEDOR") {
            navigate("/");
            return;
        }

        // Cargar productos al montar
        loadProducts();
    }, [isAuthenticated, user, navigate, loadProducts]);

    // ============ HANDLERS ============
    const handleDeleteProduct = async (id: number) => {
        if (
            window.confirm(
                "¿Estás seguro de que quieres eliminar este producto?"
            )
        ) {
            await deleteProduct(id);
        }
    };

    const handleEditProduct = (product: ProductInterface) => {
        setEditingProduct(product);
        navigate(`/editar-producto/${product.id}`);
    };

    const handleCreateNew = () => {
        navigate("/subir-producto");
    };

    const handleViewProduct = (product: ProductInterface) => {
        navigate(`/producto/${product.id}`);
    };

    // ============ FILTRADO ============
    const filteredProducts = state.products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
    );

    // ============ PROTECCIÓN EARLY RETURN ============
    if (!isAuthenticated || user?.role !== "VENDEDOR") {
        return (
            <div className={classes.vendorProducts}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.accessDenied}>
                        <h2>❌ Acceso Denegado</h2>
                        <p>Solo los vendedores pueden acceder a esta página</p>
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
        <div className={classes.vendorProducts}>
            <Header />

            <div className={classes.container}>
                {/* Header de la página */}
                <div className={classes.pageHeader}>
                    <div className={classes.headerContent}>
                        <h1 className={classes.pageTitle}>
                            📦 Gestión de Productos
                        </h1>
                        <p className={classes.pageSubtitle}>
                            Administra tu catálogo de productos en Mercadillo
                            Local
                        </p>
                    </div>
                    <button
                        onClick={handleCreateNew}
                        className={classes.createButton}
                    >
                        ➕ Nuevo Producto
                    </button>
                </div>

                {/* Barra de búsqueda y estadísticas */}
                <div className={classes.controlsSection}>
                    <div className={classes.searchContainer}>
                        <input
                            type="search"
                            placeholder="Buscar en tus productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={classes.searchInput}
                        />
                        <span className={classes.searchIcon}>🔍</span>
                    </div>

                    <div className={classes.statsContainer}>
                        <div className={classes.statCard}>
                            <span className={classes.statNumber}>
                                {state.products.length}
                            </span>
                            <span className={classes.statLabel}>
                                Total Productos
                            </span>
                        </div>
                        <div className={classes.statCard}>
                            <span className={classes.statNumber}>
                                {filteredProducts.length}
                            </span>
                            <span className={classes.statLabel}>Mostrando</span>
                        </div>
                    </div>
                </div>

                {/* Banner de error */}
                {state.error && (
                    <div className={classes.errorBanner}>
                        <span className={classes.errorIcon}>⚠️</span>
                        <span className={classes.errorText}>{state.error}</span>
                        <button
                            onClick={() => loadProducts()}
                            className={classes.retryButton}
                        >
                            🔄 Reintentar
                        </button>
                    </div>
                )}

                {/* Contenido principal */}
                <div className={classes.mainContent}>
                    {state.loading ? (
                        <div className={classes.loadingState}>
                            <div className={classes.loadingSpinner}></div>
                            <p>Cargando tus productos...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className={classes.emptyState}>
                            <span className={classes.emptyIcon}>📦</span>
                            <h3 className={classes.emptyTitle}>
                                {searchQuery
                                    ? "No se encontraron productos"
                                    : "Aún no tienes productos"}
                            </h3>
                            <p className={classes.emptyText}>
                                {searchQuery
                                    ? `No hay productos que coincidan con "${searchQuery}"`
                                    : "¡Empieza subiendo tu primer producto al mercadillo!"}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={handleCreateNew}
                                    className={classes.createFirstButton}
                                >
                                    🚀 Subir mi primer producto
                                </button>
                            )}
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className={classes.clearSearchButton}
                                >
                                    ✕ Limpiar búsqueda
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={classes.productsGrid}>
                            {filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className={classes.productCard}
                                >
                                    <div className={classes.productImage}>
                                        <img
                                            src={
                                                product.img[0] ||
                                                "/placeholder-image.jpg"
                                            }
                                            alt={product.name}
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "/placeholder-image.jpg";
                                            }}
                                        />
                                        <div className={classes.productOverlay}>
                                            <button
                                                onClick={() =>
                                                    handleEditProduct(product)
                                                }
                                                className={classes.editButton}
                                                disabled={state.updating}
                                                title="Editar producto"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDeleteProduct(
                                                        product.id
                                                    )
                                                }
                                                className={classes.deleteButton}
                                                disabled={state.deleting}
                                                title="Eliminar producto"
                                            >
                                                {state.deleting ? "🔄" : "🗑️"}{" "}
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>

                                    <div className={classes.productInfo}>
                                        <h3
                                            className={classes.productName}
                                            onClick={() =>
                                                handleViewProduct(product)
                                            }
                                            title="Ver producto"
                                        >
                                            {product.name}
                                        </h3>
                                        <p
                                            className={
                                                classes.productDescription
                                            }
                                        >
                                            {product.description}
                                        </p>

                                        <div
                                            className={
                                                classes.productCategories
                                            }
                                        >
                                            {product.categories
                                                .slice(0, 2)
                                                .map((category) => (
                                                    <span
                                                        key={category.id}
                                                        className={
                                                            classes.categoryTag
                                                        }
                                                    >
                                                        {category.name}
                                                    </span>
                                                ))}
                                            {product.categories.length > 2 && (
                                                <span
                                                    className={
                                                        classes.moreCategoriesTag
                                                    }
                                                >
                                                    +
                                                    {product.categories.length -
                                                        2}{" "}
                                                    más
                                                </span>
                                            )}
                                        </div>

                                        <div className={classes.productFooter}>
                                            <span
                                                className={classes.productPrice}
                                            >
                                                €{product.price.toFixed(2)}
                                            </span>
                                            <div
                                                className={
                                                    classes.productActions
                                                }
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleViewProduct(
                                                            product
                                                        )
                                                    }
                                                    className={
                                                        classes.viewButton
                                                    }
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleEditProduct(
                                                            product
                                                        )
                                                    }
                                                    className={
                                                        classes.quickEditButton
                                                    }
                                                    disabled={state.updating}
                                                >
                                                    ✏️
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Indicador de estado de operaciones */}
                                    {(state.updating || state.deleting) && (
                                        <div
                                            className={classes.operationOverlay}
                                        >
                                            <div
                                                className={
                                                    classes.operationSpinner
                                                }
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer con acciones adicionales */}
                <div className={classes.pageFooter}>
                    <div className={classes.footerActions}>
                        <button
                            onClick={() => loadProducts()}
                            className={classes.refreshButton}
                            disabled={state.loading}
                        >
                            🔄 Actualizar
                        </button>
                        <Link to="/perfil" className={classes.profileLink}>
                            👤 Mi Perfil
                        </Link>
                    </div>

                    <div className={classes.footerStats}>
                        <p className={classes.footerText}>
                            Mostrando {filteredProducts.length} de{" "}
                            {state.products.length} productos
                        </p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default VendorProducts;
