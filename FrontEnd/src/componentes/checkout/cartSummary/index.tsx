// src/componentes/checkout/CartSummary.tsx

import { type PaymentSummary } from "../../../types/paymentTypes";
import { paymentUtils } from "../../../services/paymentService";
import classes from "./cartSummary.module.css";

interface CartSummaryProps {
    paymentSummary: PaymentSummary | null;
    onContinue: () => void;
    onBackToCart: () => void;
}

function CartSummary({
    paymentSummary,
    onContinue,
    onBackToCart,
}: CartSummaryProps) {
    if (!paymentSummary) {
        return (
            <div className={classes.cartSummary}>
                <div className={classes.emptyState}>
                    <span className={classes.emptyIcon}>🛒</span>
                    <h2>No hay productos en el carrito</h2>
                    <button
                        onClick={onBackToCart}
                        className={classes.backButton}
                    >
                        Volver al carrito
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={classes.cartSummary}>
            <h2 className={classes.title}>Resumen de tu pedido</h2>

            <div className={classes.vendorGroups}>
                {paymentSummary.vendorGroups.map((group) => (
                    <div key={group.vendor.id} className={classes.vendorGroup}>
                        <h3 className={classes.vendorHeader}>
                            <span className={classes.vendorIcon}>🏪</span>
                            {group.vendor.name}
                        </h3>

                        <div className={classes.vendorItems}>
                            {group.items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className={classes.cartItem}
                                >
                                    <img
                                        src={
                                            item.product.img[0] ||
                                            "/placeholder-image.jpg"
                                        }
                                        alt={item.product.name}
                                        className={classes.itemImage}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "/placeholder-image.jpg";
                                        }}
                                    />
                                    <div className={classes.itemInfo}>
                                        <h4 className={classes.itemName}>
                                            {item.product.name}
                                        </h4>
                                        <p className={classes.itemDescription}>
                                            {item.product.description}
                                        </p>
                                        <div className={classes.itemDetails}>
                                            <span className={classes.quantity}>
                                                Cantidad: {item.quantity}
                                            </span>
                                            <span className={classes.unitPrice}>
                                                {paymentUtils.formatPrice(
                                                    item.unitPrice
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                    <div className={classes.itemTotal}>
                                        {paymentUtils.formatPrice(
                                            item.totalPrice
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={classes.vendorTotals}>
                            <div className={classes.vendorRow}>
                                <span>Subtotal productos:</span>
                                <span>
                                    {paymentUtils.formatPrice(group.subtotal)}
                                </span>
                            </div>
                            <div className={classes.vendorRow}>
                                <span>Comisión plataforma (5%):</span>
                                <span>
                                    -
                                    {paymentUtils.formatPrice(
                                        group.platformFee
                                    )}
                                </span>
                            </div>
                            <div className={classes.vendorTotal}>
                                <span>Total para el vendedor:</span>
                                <span>
                                    {paymentUtils.formatPrice(
                                        group.vendorAmount
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={classes.summaryTotals}>
                <div className={classes.totalRow}>
                    <span>Total productos ({paymentSummary.totalItems}):</span>
                    <span>
                        {paymentUtils.formatPrice(paymentSummary.subtotal)}
                    </span>
                </div>
                <div className={classes.totalRow}>
                    <span>Gastos de envío:</span>
                    <span>
                        {paymentSummary.shippingCost === 0
                            ? "Gratis"
                            : paymentUtils.formatPrice(
                                  paymentSummary.shippingCost
                              )}
                    </span>
                </div>
                <div className={classes.finalTotal}>
                    <span>Total a pagar:</span>
                    <span>
                        {paymentUtils.formatPrice(paymentSummary.totalAmount)}
                    </span>
                </div>
            </div>

            <div className={classes.actions}>
                <button
                    onClick={onBackToCart}
                    className={classes.secondaryButton}
                >
                    ← Modificar carrito
                </button>
                <button onClick={onContinue} className={classes.primaryButton}>
                    Continuar con el envío →
                </button>
            </div>
        </div>
    );
}

export default CartSummary;
