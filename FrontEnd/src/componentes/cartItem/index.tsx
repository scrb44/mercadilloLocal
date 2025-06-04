// src/componentes/cartItem/index.tsx
import { Link } from "react-router-dom";
import { type CartItemInterface } from "../../types/types";
import classes from "./cartItem.module.css";
import { PlaceholderURL } from "../../constants";
interface CartItemProps {
    item: CartItemInterface;
    loading?: boolean;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

function CartItem({
    item,
    loading = false,
    onUpdateQuantity,
    onRemove,
}: CartItemProps) {
    const handleQuantityChange = (newQuantity: number) => {
        if (newQuantity >= 1) {
            onUpdateQuantity(item.product.id, newQuantity);
        }
    };

    const handleRemove = () => {
        onRemove(item.product.id);
    };

    return (
        <div className={classes.cartItem}>
            {/* Imagen del producto */}
            <div className={classes.itemImage}>
                <img
                    src={item.product.img[0] || PlaceholderURL}
                    alt={item.product.name}
                    onError={(e) => {
                        e.currentTarget.src = PlaceholderURL;
                    }}
                />
            </div>

            {/* Información del producto */}
            <div className={classes.itemInfo}>
                <Link
                    to={`/producto/${item.product.id}`}
                    className={classes.itemName}
                >
                    {item.product.name}
                </Link>
                <p className={classes.itemDescription}>
                    {item.product.description}
                </p>
                <p className={classes.itemVendor}>
                    Vendedor: {item.product.vendedor.name}
                </p>
            </div>

            {/* Controles de cantidad */}
            <div className={classes.itemControls}>
                <div className={classes.quantityControl}>
                    <button
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        className={classes.quantityButton}
                        disabled={loading || item.quantity <= 1}
                    >
                        -
                    </button>
                    <span className={classes.quantityValue}>
                        {item.quantity}
                    </span>
                    <button
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                        className={classes.quantityButton}
                        disabled={loading}
                    >
                        +
                    </button>
                </div>

                <button
                    onClick={handleRemove}
                    className={classes.removeButton}
                    disabled={loading}
                >
                    🗑️ Eliminar
                </button>
            </div>

            {/* Precio */}
            <div className={classes.itemPrice}>
                <div className={classes.unitPrice}>
                    €{item.product.price.toFixed(2)} c/u
                </div>
                <div className={classes.totalItemPrice}>
                    €{(item.product.price * item.quantity).toFixed(2)}
                </div>
            </div>
        </div>
    );
}

export default CartItem;
