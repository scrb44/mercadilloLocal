// src/pages/productDetail/index.tsx - MODULARIZADO
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import { useProduct } from "../../hooks";
import {
    ProductBreadcrumb,
    ProductGallery,
    Footer,
    Header,
} from "../../componentes";

import classes from "./productDetail.module.css";

function ProductDetail() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const cart = isAuthenticated ? useCart() : null;
    const [quantity, setQuantity] = useState(1);

    // Usar hook personalizado
    const { producto, loading, error } = useProduct(productId);

    // ============ HANDLERS ============
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir productos al carrito");
            return;
        }

        if (!cart || !producto) return;

        try {
            await cart.addItem(producto, quantity);
            alert(`${quantity} ${producto.name}(s) añadido(s) al carrito`);
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Error al añadir producto al carrito");
        }
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para comprar");
            return;
        }

        handleAddToCart().then(() => {
            navigate("/carrito");
        });
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    // ============ RENDER STATES ============
    if (!productId) {
        return (
            <div className={classes.productDetail}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <p>ID de producto no válido</p>
                        <Link to="/" className={classes.backLink}>
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className={classes.productDetail}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loadingState}>
                        <div className={classes.loadingSpinner}></div>
                        <p>Cargando producto...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.productDetail}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <p>{error}</p>
                        <Link to="/" className={classes.backLink}>
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!producto) {
        return (
            <div className={classes.productDetail}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <p>Producto no encontrado</p>
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
        <div className={classes.productDetail}>
            <Header />

            <div className={classes.container}>
                {/* Breadcrumb del producto */}
                <ProductBreadcrumb product={producto} />

                {/* Contenido principal */}
                <div className={classes.productContent}>
                    {/* Galería de imágenes - COMPONENTE MODULARIZADO */}
                    <ProductGallery
                        images={producto.img}
                        productName={producto.name}
                    />

                    {/* Información del producto */}
                    <div className={classes.infoSection}>
                        <h1 className={classes.productName}>{producto.name}</h1>

                        <div className={classes.priceSection}>
                            <span className={classes.price}>
                                €{producto.price}
                            </span>
                        </div>

                        <div className={classes.vendorInfo}>
                            <span className={classes.vendorLabel}>
                                Vendedor:
                            </span>
                            <span className={classes.vendorName}>
                                {producto.vendedor.name}
                            </span>
                        </div>

                        <div className={classes.description}>
                            <h3 className={classes.descriptionTitle}>
                                Descripción
                            </h3>
                            <p className={classes.descriptionText}>
                                {producto.description}
                            </p>
                        </div>

                        <div className={classes.categories}>
                            <h4 className={classes.categoriesTitle}>
                                Categorías:
                            </h4>
                            <div className={classes.categoryTags}>
                                {producto.categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        to={`/categoria/${category.id}`}
                                        className={classes.categoryTag}
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className={classes.purchaseSection}>
                            <div className={classes.quantityControl}>
                                <label className={classes.quantityLabel}>
                                    Cantidad:
                                </label>
                                <div className={classes.quantityInput}>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(quantity - 1)
                                        }
                                        className={classes.quantityButton}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span className={classes.quantityValue}>
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={() =>
                                            handleQuantityChange(quantity + 1)
                                        }
                                        className={classes.quantityButton}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className={classes.totalPrice}>
                                <span className={classes.totalLabel}>
                                    Total:
                                </span>
                                <span className={classes.totalValue}>
                                    €{(producto.price * quantity).toFixed(2)}
                                </span>
                            </div>

                            <div className={classes.actionButtons}>
                                {isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={cart?.loading}
                                            className={`${classes.actionButton} ${classes.addToCartButton}`}
                                        >
                                            {cart?.loading
                                                ? "Añadiendo..."
                                                : "Añadir al carrito"}
                                        </button>
                                        <button
                                            onClick={handleBuyNow}
                                            disabled={cart?.loading}
                                            className={`${classes.actionButton} ${classes.buyNowButton}`}
                                        >
                                            Comprar ahora
                                        </button>
                                    </>
                                ) : (
                                    <div className={classes.loginPrompt}>
                                        <p className={classes.loginText}>
                                            Inicia sesión para comprar este
                                            producto
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default ProductDetail;
