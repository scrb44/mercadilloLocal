// src/pages/productDetail/index.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import mercadilloService from "../../services";
import { type ProductInterface } from "../../types/types";

import Footer from "../../componentes/footer";
import Header from "../../componentes/header";

import classes from "./productDetail.module.css";

function ProductDetail() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useUser();
    const cart = isAuthenticated ? useCart() : null;

    // ============ ESTADO LOCAL ============
    const [producto, setProducto] = useState<ProductInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    // ============ CARGAR PRODUCTO ============
    useEffect(() => {
        if (!productId) return;

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError(null);

                const data = await mercadilloService.getProduct(
                    parseInt(productId)
                );
                setProducto(data);
            } catch (err: any) {
                setError(err.message || "Error al cargar el producto");
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [productId]);

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

    const handleImageChange = (index: number) => {
        setSelectedImageIndex(index);
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
                {/* Breadcrumb */}
                <div className={classes.breadcrumb}>
                    <Link to="/" className={classes.breadcrumbLink}>
                        Inicio
                    </Link>
                    {producto.categories.length > 0 && (
                        <>
                            <span className={classes.breadcrumbSeparator}>
                                ›
                            </span>
                            <Link
                                to={`/categoria/${producto.categories[0].id}`}
                                className={classes.breadcrumbLink}
                            >
                                {producto.categories[0].name}
                            </Link>
                        </>
                    )}
                    <span className={classes.breadcrumbSeparator}>›</span>
                    <span className={classes.breadcrumbCurrent}>
                        {producto.name}
                    </span>
                </div>

                {/* Contenido principal */}
                <div className={classes.productContent}>
                    {/* Galería de imágenes */}
                    <div className={classes.imageSection}>
                        <div className={classes.mainImageContainer}>
                            <img
                                src={
                                    producto.img[selectedImageIndex] ||
                                    producto.img[0] ||
                                    "/placeholder-image.jpg"
                                }
                                alt={producto.name}
                                className={classes.mainImage}
                                onError={(e) => {
                                    e.currentTarget.src =
                                        "/placeholder-image.jpg";
                                }}
                            />
                        </div>

                        {producto.img.length > 1 && (
                            <div className={classes.thumbnailContainer}>
                                {producto.img.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image}
                                        alt={`${producto.name} ${index + 1}`}
                                        className={`${classes.thumbnail} ${
                                            index === selectedImageIndex
                                                ? classes.thumbnailActive
                                                : ""
                                        }`}
                                        onClick={() => handleImageChange(index)}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/placeholder-image.jpg";
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

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

                        {/* Controles de compra */}
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
