// src/componentes/productCard/index.tsx - ACTUALIZADO
import { Link } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import { type ProductInterface } from "../../types/types";
import classes from "./ProductCard.module.css";

interface ProductCardProps {
    product: ProductInterface;
    onAddToCart?: (product: ProductInterface) => void;
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const { user, isAuthenticated } = useUser();
    const cart = isAuthenticated ? useCart() : null;

    console.log("📦 Product recibido en ProductCard:", product);

    const handleAddToCart = async (e: React.MouseEvent) => {
        // Prevenir que el click propague al Link
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            alert("Debes iniciar sesión para añadir productos al carrito");
            return;
        }

        if (!cart) return;

        try {
            await cart.addItem(product, 1);
            console.log("✅ Producto añadido al carrito:", product.name);

            // Llamar callback si se proporciona
            if (onAddToCart) {
                onAddToCart(product);
            }
        } catch (error) {
            console.error("❌ Error adding to cart:", error);
            alert("Error al añadir producto al carrito");
        }
    };
    console.log("Hola");
console.log(product);
    return (
        <Link
            to={`/producto/${product.id}`}
            className={classes.productCardLink}
        >
            <div className={classes.productCard}>
                <div className={classes.imageContainer}>
                    <img
                        src={product.img?.[0] || "https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg"}
                        alt={product.name}
                        className={classes.productImage}
                        onError={(e) => {
                            e.currentTarget.src = "https://www.shutterstock.com/image-illustration/image-not-found-grayscale-photo-260nw-2425909941.jpg";
                        }}
                    />
                </div>

                <div className={classes.productInfo}>
                    <h3 className={classes.productName}>{product.name}</h3>
                    <p className={classes.productDescription}>
                        {product.description}
                    </p>
                    <p className={classes.productPrice}>€{product.price}</p>
                    <p className={classes.productVendor}>
           Vendedor: {product.vendedor?.nombre || "Sin especificar prodcut card"}
                 </p>
                </div>
                <div className={classes.productActions}>
                    {isAuthenticated ? (
                        <button
                            onClick={handleAddToCart}
                            disabled={cart?.loading}
                            className={`${classes.addButton} ${classes.authenticated}`}
                        >
                            {cart?.loading
                                ? "Añadiendo..."
                                : "Añadir al carrito"}
                        </button>
                    ) : (
                        <div className={classes.unauthenticatedMessage}>
                            <small>Inicia sesión para comprar</small>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
