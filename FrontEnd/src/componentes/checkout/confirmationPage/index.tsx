// src/componentes/checkout/ConfirmationPage.tsx

import {
    type PaymentSummary,
    type BillingInfo,
} from "../../../types/paymentTypes";
import { paymentUtils } from "../../../services/paymentService";
import classes from "./confirmationPage.module.css";

interface ConfirmationPageProps {
    orderId?: string;
    paymentSummary: PaymentSummary | null;
    billingInfo: BillingInfo | null;
    onReset: () => void;
}

function ConfirmationPage({
    orderId,
    paymentSummary,
    billingInfo,
    onReset,
}: ConfirmationPageProps) {
    const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    return (
        <div className={classes.confirmationPage}>
            <div className={classes.successHeader}>
                <div className={classes.successIcon}>✅</div>
                <h1 className={classes.successTitle}>
                    ¡Pago realizado con éxito!
                </h1>
                <p className={classes.successSubtitle}>
                    Tu pedido ha sido procesado correctamente
                </p>
            </div>

            {orderId && (
                <div className={classes.orderInfo}>
                    <div className={classes.orderNumber}>
                        <span className={classes.orderLabel}>
                            Número de pedido:
                        </span>
                        <span className={classes.orderValue}>{orderId}</span>
                    </div>
                </div>
            )}

            {paymentSummary && (
                <div className={classes.orderSummary}>
                    <h3 className={classes.sectionTitle}>Resumen del pedido</h3>

                    {paymentSummary.vendorGroups.map((group) => (
                        <div
                            key={group.vendor.id}
                            className={classes.vendorGroup}
                        >
                            <h4 className={classes.vendorName}>
                                🏪 {group.vendor.name}
                            </h4>

                            {group.items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className={classes.orderItem}
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
                                    <div className={classes.itemDetails}>
                                        <span className={classes.itemName}>
                                            {item.product.name}
                                        </span>
                                        <span className={classes.itemQuantity}>
                                            Cantidad: {item.quantity}
                                        </span>
                                    </div>
                                    <div className={classes.itemPrice}>
                                        {paymentUtils.formatPrice(
                                            item.totalPrice
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}

                    <div className={classes.totalSection}>
                        <div className={classes.totalRow}>
                            <span>Total pagado:</span>
                            <span className={classes.totalAmount}>
                                {paymentUtils.formatPrice(
                                    paymentSummary.totalAmount
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {billingInfo && (
                <div className={classes.deliveryInfo}>
                    <h3 className={classes.sectionTitle}>
                        Información de entrega
                    </h3>

                    <div className={classes.deliveryDetails}>
                        <div className={classes.deliveryRow}>
                            <span className={classes.deliveryLabel}>
                                Entrega estimada:
                            </span>
                            <span className={classes.deliveryValue}>
                                {estimatedDelivery.toLocaleDateString("es-ES", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </div>

                        <div className={classes.deliveryRow}>
                            <span className={classes.deliveryLabel}>
                                Dirección:
                            </span>
                            <div className={classes.deliveryAddress}>
                                <div>
                                    {billingInfo.shippingAddress.fullName}
                                </div>
                                <div>
                                    {billingInfo.shippingAddress.address1}
                                </div>
                                {billingInfo.shippingAddress.address2 && (
                                    <div>
                                        {billingInfo.shippingAddress.address2}
                                    </div>
                                )}
                                <div>
                                    {billingInfo.shippingAddress.postalCode}{" "}
                                    {billingInfo.shippingAddress.city}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={classes.nextSteps}>
                <h3 className={classes.sectionTitle}>¿Qué sigue?</h3>
                <ul className={classes.stepsList}>
                    <li>📧 Recibirás un email de confirmación en breve</li>
                    <li>📦 Los vendedores prepararán tu pedido</li>
                    <li>🚚 Te notificaremos cuando esté en camino</li>
                    <li>🏠 Recibirás tu pedido en la dirección indicada</li>
                </ul>

                <div className={classes.successNote}>
                    <div className={classes.noteIcon}>💡</div>
                    <div className={classes.noteText}>
                        <strong>¡Pago procesado correctamente!</strong>
                        <br />
                        Este es un entorno de pruebas - No se ha realizado
                        ningún cargo real.
                        <br />
                        Tu carrito ha sido vaciado y el pedido ha sido
                        registrado.
                    </div>
                </div>
            </div>

            <div className={classes.actions}>
                <button onClick={onReset} className={classes.primaryButton}>
                    🛍️ Seguir comprando
                </button>
                <button
                    onClick={() => (window.location.href = "/")}
                    className={classes.secondaryButton}
                >
                    🏠 Ir al inicio
                </button>
            </div>
        </div>
    );
}

export default ConfirmationPage;
