// src/pages/checkout/index.tsx - VERSIÓN ARREGLADA

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import { usePayment } from "../../contexts/paymentContext";
import { type PaymentItem } from "../../types/paymentTypes";
import { Header, Footer, SimpleBreadcrumb } from "../../componentes";
import CheckoutSteps from "../../componentes/checkout/checkoutSteps";
import CartSummary from "../../componentes/checkout/cartSummary";
import ShippingForm from "../../componentes/checkout/shippingForm";
import PaymentForm from "../../componentes/checkout/paymentForm";
import ConfirmationPage from "../../componentes/checkout/confirmationPage";
import classes from "./checkout.module.css";

function Checkout() {
    const navigate = useNavigate();
    const { isAuthenticated } = useUser();

    // Verificación de cart más segura
    let cart = null;
    try {
        cart = isAuthenticated ? useCart() : null;
    } catch (error) {
        console.error("❌ Error obteniendo cart:", error);
    }

    // Verificación de payment más segura
    let payment = null;
    try {
        payment = usePayment();
    } catch (error) {
        console.error("❌ Error obteniendo payment context:", error);
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <h2>❌ Error de configuración</h2>
                        <p>El contexto de pagos no está disponible.</p>
                        <p>
                            Asegúrate de que PaymentProvider esté envolviendo
                            esta página en App.tsx
                        </p>
                        <button
                            onClick={() => navigate("/carrito")}
                            className={classes.backButton}
                        >
                            ← Volver al carrito
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============ DEBUG ============
    console.log("🔧 Checkout Debug:", {
        isAuthenticated,
        hasCart: !!cart,
        cartItems: cart?.items?.length || 0,
        hasPayment: !!payment,
        paymentState: payment?.state?.currentStep || "undefined",
        paymentSummary: !!payment?.state?.paymentSummary,
    });

    // ============ EFECTOS ============
    useEffect(() => {
        console.log("🔧 Checkout useEffect ejecutándose...");

        // Redirigir si no está autenticado
        if (!isAuthenticated) {
            console.log("❌ Usuario no autenticado, redirigiendo...");
            navigate("/login?redirect=/checkout");
            return;
        }

        // Verificar que cart existe
        if (!cart) {
            console.error("❌ Cart no disponible");
            navigate("/carrito");
            return;
        }

        // Verificar que payment existe
        if (!payment) {
            console.error("❌ Payment context no disponible");
            return;
        }

        // Redirigir si el carrito está vacío (excepto si ya estamos en confirmación o el pago está completado)
        if (
            cart.items.length === 0 &&
            payment.state.currentStep !== "confirmation" &&
            !payment.state.completed
        ) {
            console.log(
                "❌ Carrito vacío y no hay pago completado, redirigiendo..."
            );
            navigate("/carrito");
            return;
        }

        // Inicializar el pago si no está inicializado
        if (!payment.state.paymentSummary && cart.items.length > 0) {
            console.log("✅ Inicializando pago...");
            try {
                // Convertir items del carrito al formato PaymentItem
                const paymentItems = cart.items.map((item) => ({
                    product: item.product,
                    quantity: item.quantity,
                    unitPrice: item.product.price,
                    totalPrice: item.product.price * item.quantity,
                    vendor: item.product.vendedor,
                }));

                // Pasar los items convertidos al initializePayment
                payment.initializePayment(paymentItems);
                console.log("✅ Pago inicializado correctamente");
            } catch (error) {
                console.error("❌ Error inicializando pago:", error);
                payment.setError(
                    "Error inicializando el pago: " + (error as Error).message
                );
            }
        }
    }, [isAuthenticated, cart?.items?.length, payment, navigate]);

    // ============ HANDLERS ============
    const handleStepChange = (step: any) => {
        if (payment) {
            payment.goToStep(step);
        }
    };

    const handleContinueToPayment = () => {
        if (!payment) return;

        if (!payment.state.billingInfo) {
            payment.setError("Por favor, complete la información de envío");
            return;
        }
        payment.nextStep();
    };

    const handleBackToShipping = () => {
        if (payment) {
            payment.previousStep();
        }
    };

    const handleProcessPayment = async () => {
        if (!payment) return;

        try {
            await payment.processPayment();
        } catch (error: any) {
            payment.setError(error.message || "Error procesando el pago");
        }
    };

    const handleBackToCart = () => {
        navigate("/carrito");
    };

    // ============ RENDER CONDICIONAL PARA ERRORES ============

    if (!isAuthenticated) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loginPrompt}>
                        <h2>🔐 Inicia sesión para continuar</h2>
                        <p>Necesitas una cuenta para proceder con el pago</p>
                        <button
                            onClick={() =>
                                navigate("/login?redirect=/checkout")
                            }
                            className={classes.primaryButton}
                        >
                            Ir al login
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!cart) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <h2>❌ Error del carrito</h2>
                        <p>No se pudo cargar la información del carrito</p>
                        <button
                            onClick={() => navigate("/carrito")}
                            className={classes.backButton}
                        >
                            ← Volver al carrito
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!payment) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <h2>❌ Error de configuración</h2>
                        <p>El sistema de pagos no está disponible</p>
                        <button
                            onClick={() => navigate("/carrito")}
                            className={classes.backButton}
                        >
                            ← Volver al carrito
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (cart.loading) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loadingState}>
                        <div className={classes.loadingSpinner}></div>
                        <p>Cargando información del carrito...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============ RENDER PRINCIPAL ============
    return (
        <div className={classes.checkout}>
            <Header />

            <div className={classes.container}>
                {/* Breadcrumb */}
                <SimpleBreadcrumb
                    pageName="Checkout"
                    parentPath="/carrito"
                    parentName="Carrito"
                />

                {/* Indicador de pasos */}
                <CheckoutSteps
                    currentStep={payment.state.currentStep}
                    onStepClick={handleStepChange}
                />

                {/* Banner de error */}
                {payment.state.error && (
                    <div className={classes.errorBanner}>
                        <span className={classes.errorIcon}>⚠️</span>
                        <span className={classes.errorText}>
                            {payment.state.error}
                        </span>
                        <button
                            onClick={() => payment.setError(null)}
                            className={classes.dismissError}
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Contenido principal */}
                <div className={classes.checkoutContent}>
                    <div className={classes.mainContent}>
                        {/* Paso 1: Resumen del carrito */}
                        {payment.state.currentStep === "cart" && (
                            <CartSummary
                                paymentSummary={payment.state.paymentSummary}
                                onContinue={() => payment.nextStep()}
                                onBackToCart={handleBackToCart}
                            />
                        )}

                        {/* Paso 2: Información de envío */}
                        {payment.state.currentStep === "shipping" && (
                            <ShippingForm
                                billingInfo={payment.state.billingInfo}
                                onUpdateBillingInfo={payment.updateBillingInfo}
                                onContinue={handleContinueToPayment}
                                onBack={() => payment.previousStep()}
                                loading={payment.state.processing}
                            />
                        )}

                        {/* Paso 3: Método de pago */}
                        {payment.state.currentStep === "payment" && (
                            <PaymentForm
                                paymentSummary={payment.state.paymentSummary}
                                billingInfo={payment.state.billingInfo}
                                selectedPaymentMethod={
                                    payment.state.selectedPaymentMethod
                                }
                                onSelectPaymentMethod={
                                    payment.selectPaymentMethod
                                }
                                onProcessPayment={handleProcessPayment}
                                onBack={handleBackToShipping}
                                loading={payment.state.processing}
                            />
                        )}

                        {/* Paso 4: Confirmación */}
                        {payment.state.currentStep === "confirmation" && (
                            <ConfirmationPage
                                orderId={payment.state.orderId}
                                paymentSummary={payment.state.paymentSummary}
                                billingInfo={payment.state.billingInfo}
                                onReset={() => {
                                    payment.reset();
                                    navigate("/");
                                }}
                            />
                        )}
                    </div>

                    {/* Sidebar con resumen (solo en pasos shipping y payment) */}
                    {(payment.state.currentStep === "shipping" ||
                        payment.state.currentStep === "payment") &&
                        payment.state.paymentSummary && (
                            <div className={classes.sidebar}>
                                <div className={classes.orderSummary}>
                                    <h3 className={classes.summaryTitle}>
                                        Resumen del pedido
                                    </h3>

                                    {/* Productos por vendedor */}
                                    {payment.state.paymentSummary.vendorGroups.map(
                                        (group, index) => (
                                            <div
                                                key={group.vendor.id}
                                                className={classes.vendorGroup}
                                            >
                                                <h4
                                                    className={
                                                        classes.vendorName
                                                    }
                                                >
                                                    📦 {group.vendor.name}
                                                </h4>
                                                {group.items.map((item) => (
                                                    <div
                                                        key={item.product.id}
                                                        className={
                                                            classes.summaryItem
                                                        }
                                                    >
                                                        <span
                                                            className={
                                                                classes.itemName
                                                            }
                                                        >
                                                            {item.quantity}x{" "}
                                                            {item.product.name}
                                                        </span>
                                                        <span
                                                            className={
                                                                classes.itemPrice
                                                            }
                                                        >
                                                            €
                                                            {item.totalPrice.toFixed(
                                                                2
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div
                                                    className={
                                                        classes.vendorSubtotal
                                                    }
                                                >
                                                    <span>
                                                        Subtotal vendedor:
                                                    </span>
                                                    <span>
                                                        €
                                                        {group.vendorAmount.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                                <div
                                                    className={
                                                        classes.platformFee
                                                    }
                                                >
                                                    <span>
                                                        Comisión plataforma:
                                                    </span>
                                                    <span>
                                                        €
                                                        {group.platformFee.toFixed(
                                                            2
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )}

                                    {/* Totales */}
                                    <div className={classes.summaryTotals}>
                                        <div className={classes.summaryRow}>
                                            <span>Subtotal:</span>
                                            <span>
                                                €
                                                {payment.state.paymentSummary.subtotal.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                        <div className={classes.summaryRow}>
                                            <span>Envío:</span>
                                            <span>
                                                {payment.state.paymentSummary
                                                    .shippingCost === 0
                                                    ? "Gratis"
                                                    : `€${payment.state.paymentSummary.shippingCost.toFixed(
                                                          2
                                                      )}`}
                                            </span>
                                        </div>
                                        <div
                                            className={classes.summaryDivider}
                                        ></div>
                                        <div
                                            className={`${classes.summaryRow} ${classes.totalRow}`}
                                        >
                                            <span>Total:</span>
                                            <span>
                                                €
                                                {payment.state.paymentSummary.totalAmount.toFixed(
                                                    2
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Checkout;
