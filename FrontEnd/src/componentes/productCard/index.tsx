import React, { useState } from "react";
import { useUser, useCart } from "../../contexts";
import { type ProductInterface } from "../../types/types";
import classes from "./productCard.module.css";

interface ProductCardProps {
    product: ProductInterface;
    onAddToCart?: (product: ProductInterface) => void; // Callback opcional
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const [localLoading, setLocalLoading] = useState(false);

    // ============ CONTEXTS ============
    const { user, isAuthenticated } = useUser();
    const cart = isAuthenticated ? useCart() : null;

    // ============ ESTADO DEL CARRITO ============
    const quantity = cart ? cart.getItemQuantity(product.id) : 0;
    const inCart = cart ? cart.isInCart(product.id) : false;

    // ============ HANDLERS ============
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir productos al carrito");
            return;
        }

        if (!cart) return;

        setLocalLoading(true);
        try {
            await cart.addItem(product, 1);

            // Llamar callback si se proporciona
            if (onAddToCart) {
                onAddToCart(product);
            }
        } catch (error) {
            console.error("Error al añadir producto:", error);
            alert("Error al añadir producto al carrito");
        } finally {
            setLocalLoading(false);
        }
    };

    const handleUpdateQuantity = async (newQuantity: number) => {
        if (!cart) return;

        setLocalLoading(true);
        try {
            await cart.updateQuantity(product.id, newQuantity);
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleRemoveFromCart = async () => {
        if (!cart) return;

        setLocalLoading(true);
        try {
            await cart.removeItem(product.id);
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        } finally {
            setLocalLoading(false);
        }
    };

    // ============ RENDER ============
    return (
        <div className={classes["producto"]}>
            {/* Imagen del producto */}
            <img
                src={product.img[0]}
                alt={product.name}
                className={classes["producto-imagen"]}
                width={150}
            />

            {/* Información del producto */}
            <div className={classes["producto-info"]}>
                <h3 className={classes["producto-nombre"]}>{product.name}</h3>
                <p className={classes["producto-descripcion"]}>
                    {product.description}
                </p>
                <p className={classes["producto-precio"]}>€{product.price}</p>
                <p className={classes["producto-vendedor"]}>
                    Vendedor: {product.vendedor.name}
                </p>
            </div>

            {/* Controles del carrito */}
            <div className={classes["cart-controls"]}>
                {!isAuthenticated ? (
                    <button
                        className={classes["login-btn"]}
                        onClick={() => alert("Inicia sesión para comprar")}
                    >
                        Iniciar sesión para comprar
                    </button>
                ) : !inCart ? (
                    <button
                        onClick={handleAddToCart}
                        className={classes["add-to-cart-btn"]}
                    >
                        {localLoading ? "Añadiendo..." : "Añadir al carrito"}
                    </button>
                ) : (
                    <div className={classes["quantity-controls"]}>
                        <button
                            onClick={() => handleUpdateQuantity(quantity - 1)}
                            className={classes["quantity-btn"]}
                        >
                            -
                        </button>

                        <span className={classes["quantity-display"]}>
                            {quantity}
                        </span>

                        <button
                            onClick={() => handleUpdateQuantity(quantity + 1)}
                            className={classes["quantity-btn"]}
                        >
                            +
                        </button>

                        <button
                            onClick={handleRemoveFromCart}
                            className={classes["remove-btn"]}
                        >
                            Eliminar
                        </button>
                    </div>
                )}
            </div>

            {/* Mostrar errores del carrito */}
            {cart?.error && (
                <div className={classes["error-message"]}>{cart.error}</div>
            )}
        </div>
    );
}

export default ProductCard;
