// src/pages/cart/index.tsx - ACTUALIZADO CON BOTÓN DE CHECKOUT

import { Link, useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import { CartItem, Footer, Header } from "../../componentes";

import classes from "./Cart.module.css";

function Cart() {
    const { isAuthenticated } = useUser();
    const cart = isAuthenticated ? useCart() : null;
    const navigate = useNavigate();

    // ============ HANDLERS ============
    const handleUpdateQuantity = async (
        productId: number,
        newQuantity: number
    ) => {
        if (!cart) return;

        try {
            await cart.updateQuantity(productId, newQuantity);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const handleRemoveItem = async (productId: number) => {
        if (!cart) return;

        try {
            await cart.removeItem(productId);
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const handleClearCart = async () => {
        if (!cart) return;

        if (window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
            try {
                await cart.clearCart();
            } catch (error) {
                console.error("Error clearing cart:", error);
            }
        }
    };

    // NUEVO: Handler para ir al checkout
    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate("/login?redirect=/checkout");
            return;
        }

        if (cart && cart.items.length > 0) {
            navigate("/checkout");
        }
    };

    const handleContinueShopping = () => {
        navigate("/");
    };

    // ============ RENDER STATES ============
    if (!isAuthenticated) {
        return (
            <div className={classes.cart}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.unauthenticatedState}>
                        <h1 className={classes.title}>Tu Carrito</h1>
                        <div className={classes.loginPrompt}>
                            <p className={classes.loginText}>
                                Debes iniciar sesión para ver tu carrito
                            </p>
                            <Link to="/" className={classes.backLink}>
                                ← Volver al inicio
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!cart) {
        return (
            <div className={classes.cart}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <p>Error al cargar el carrito</p>
                        <Link to="/" className={classes.backLink}>
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (cart.loading) {
        return (
            <div className={classes.cart}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loadingState}>
                        <div className={classes.loadingSpinner}></div>
                        <p>Cargando carrito...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============ RENDER PRINCIPAL ============
    return (
        <div className={classes.cart}>
            <Header />

            <div className={classes.container}>
                <div className={classes.cartHeader}>
                    <h1 className={classes.title}>Tu Carrito</h1>
                    <div className={classes.cartSummary}>
                        <span className={classes.itemCount}>
                            {cart.totalItems} producto
                            {cart.totalItems !== 1 ? "s" : ""}
                        </span>
                        <span className={classes.totalPrice}>
                            Total: €{cart.totalPrice.toFixed(2)}
                        </span>
                    </div>
                </div>

                {cart.error && (
                    <div className={classes.errorBanner}>
                        <span className={classes.errorIcon}>⚠️</span>
                        <span className={classes.errorText}>{cart.error}</span>
                    </div>
                )}

                {cart.items.length === 0 ? (
                    <div className={classes.emptyCart}>
                        <span className={classes.emptyIcon}>🛒</span>
                        <h2 className={classes.emptyTitle}>
                            Tu carrito está vacío
                        </h2>
                        <p className={classes.emptyText}>
                            ¡Explora nuestros productos y añade algunos a tu
                            carrito!
                        </p>
                        <button
                            onClick={handleContinueShopping}
                            className={classes.continueShoppingButton}
                        >
                            Continuar comprando
                        </button>
                    </div>
                ) : (
                    <div className={classes.cartContent}>
                        <div className={classes.cartItems}>
                            {cart.items.map((item) => (
                                <CartItem
                                    key={item.product.id}
                                    item={item}
                                    loading={cart.loading}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>

                        <div className={classes.cartSidebar}>
                            <div className={classes.cartSummaryCard}>
                                <h3 className={classes.summaryTitle}>
                                    Resumen del pedido
                                </h3>

                                <div className={classes.summaryRow}>
                                    <span>Productos ({cart.totalItems})</span>
                                    <span>€{cart.totalPrice.toFixed(2)}</span>
                                </div>

                                <div className={classes.summaryRow}>
                                    <span>Envío</span>
                                    <span>Gratis</span>
                                </div>

                                <div className={classes.summaryDivider}></div>

                                <div
                                    className={`${classes.summaryRow} ${classes.summaryTotal}`}
                                >
                                    <span>Total</span>
                                    <span>€{cart.totalPrice.toFixed(2)}</span>
                                </div>

                                <div className={classes.checkoutActions}>
                                    {/* ACTUALIZADO: Botón de checkout */}
                                    <button
                                        onClick={handleCheckout}
                                        className={classes.checkoutButton}
                                        disabled={
                                            cart.loading ||
                                            cart.items.length === 0
                                        }
                                    >
                                        🚀 Proceder al pago
                                    </button>

                                    <button
                                        onClick={handleContinueShopping}
                                        className={classes.continueButton}
                                    >
                                        Continuar comprando
                                    </button>

                                    <button
                                        onClick={handleClearCart}
                                        className={classes.clearCartButton}
                                        disabled={cart.loading}
                                    >
                                        Vaciar carrito
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Cart;
