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

    const handleAddToCart = async () => {
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

    return (
        <div className={classes.productCard}>
            <div className={classes.imageContainer}>
                <img
                    src={product.img[0]}
                    alt={product.name}
                    className={classes.productImage}
                />
            </div>

            <div className={classes.productInfo}>
                <h3 className={classes.productName}>{product.name}</h3>
                <p className={classes.productDescription}>
                    {product.description}
                </p>
                <p className={classes.productPrice}>€{product.price}</p>
                <p className={classes.productVendor}>
                    Vendedor: {product.vendedor.name}
                </p>
            </div>

            <div className={classes.productActions}>
                <button
                    onClick={handleAddToCart}
                    disabled={cart?.loading}
                    className={`${classes.addButton} ${
                        isAuthenticated
                            ? classes.authenticated
                            : classes.unauthenticated
                    }`}
                >
                    {isAuthenticated ? "Añadir al carrito" : "Inicia sesión"}
                </button>
            </div>
        </div>
    );
}

export default ProductCard;
