// src/pages/checkout/index.tsx - CON VALIDACIÓN DE ROL

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import { PaymentProvider, usePayment } from "../../contexts/paymentContext";
import {
    type PaymentItem,
    type UserPaymentData,
} from "../../types/paymentTypes";
import { Header, Footer, SimpleBreadcrumb } from "../../componentes";
import CheckoutSteps from "../../componentes/checkout/checkoutSteps";
import CartSummary from "../../componentes/checkout/cartSummary";
import ShippingForm from "../../componentes/checkout/shippingForm";
import PaymentForm from "../../componentes/checkout/paymentForm";
import ConfirmationPage from "../../componentes/checkout/confirmationPage";
import classes from "./checkout.module.css";

// ✅ COMPONENTE INTERNO que usa el PaymentProvider
function CheckoutContent() {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useUser();
    const cart = useCart();
    const payment = usePayment();

    // ============ VALIDACIÓN DE ROL ============
    const rolesPermitidos = ["COMPRADOR", "VENDEDOR", "ADMIN"];
    const puedeComprar = user?.role && rolesPermitidos.includes(user.role);

    // ============ DEBUG ============
    console.log("🔧 Checkout Debug:", {
        isAuthenticated,
        hasUser: !!user,
        userRole: user?.role,
        puedeComprar,
        hasCart: !!cart,
        cartItems: cart?.items?.length || 0,
        hasPayment: !!payment,
        paymentState: payment?.state?.currentStep || "undefined",
        paymentSummary: !!payment?.state?.paymentSummary,
        completed: payment?.state?.completed || false,
        orderId: payment?.state?.orderId || "none",
    });

    // ============ EFECTOS ============
    useEffect(() => {
        console.log("🔧 Checkout useEffect ejecutándose...");

        // Redirigir si no está autenticado
        if (!isAuthenticated || !user) {
            console.log("❌ Usuario no autenticado, redirigiendo...");
            navigate("/login?redirect=/checkout");
            return;
        }

        // ✅ NUEVA VALIDACIÓN: Solo roles permitidos pueden hacer checkout
        if (!puedeComprar) {
            console.log("❌ Usuario no puede hacer checkout, rol no permitido");
            return; // No redirigimos, mostramos mensaje
        }

        // Verificar que cart existe
        if (!cart) {
            console.error("❌ Cart no disponible");
            navigate("/carrito");
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
                const paymentItems: PaymentItem[] = cart.items.map((item) => ({
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
    }, [
        isAuthenticated,
        user,
        puedeComprar,
        cart?.items?.length,
        payment,
        navigate,
    ]);

    // ============ HANDLERS ============

    const handleStepChange = (step: any) => {
        if (payment?.goToStep) {
            payment.goToStep(step);
        }
    };

    const handleBackToCart = () => {
        navigate("/carrito");
    };

    const handleContinueToPayment = () => {
        // Validar información de envío antes de continuar
        if (!payment?.state.billingInfo) {
            payment?.setError("Por favor, completa la información de envío");
            return;
        }

        const billingInfo = payment.state.billingInfo;

        // Validaciones básicas
        if (!billingInfo.email || !billingInfo.shippingAddress.fullName) {
            payment?.setError(
                "Por favor, completa todos los campos requeridos"
            );
            return;
        }

        if (
            !billingInfo.shippingAddress.address1 ||
            !billingInfo.shippingAddress.city
        ) {
            payment?.setError("Por favor, completa la dirección de envío");
            return;
        }

        payment?.nextStep();
    };

    const handleBackToShipping = () => {
        payment?.previousStep();
    };

    const handleProcessPayment = async () => {
        if (!payment?.state.selectedPaymentMethod) {
            payment?.setError("Por favor, selecciona un método de pago");
            return;
        }

        if (!user) {
            payment?.setError("Error: Usuario no autenticado");
            return;
        }

        // ✅ VALIDACIÓN ADICIONAL: Verificar que puede comprar
        if (!puedeComprar) {
            payment?.setError(
                "Tu rol no está autorizado para realizar pedidos"
            );
            return;
        }

        try {
            console.log("🔧 Iniciando procesamiento de pago...");

            // ✅ USAR ROL REAL DEL USUARIO
            const userData: UserPaymentData = {
                id: user.id,
                role: user.role, // ✅ USAR EL ROL REAL (puede ser COMPRADOR, VENDEDOR o ADMIN)
                nombre: user.nombre,
                email: user.email,
            };

            console.log("🔧 Datos del usuario para pago:", userData);

            // Procesar el pago
            const pedidoCreado = await payment.processPayment(userData);

            if (pedidoCreado) {
                console.log("✅ Pago procesado exitosamente");

                // ✅ LIMPIAR CARRITO DESPUÉS DEL PAGO EXITOSO
                try {
                    await cart.clearCart();
                    console.log("✅ Carrito limpiado exitosamente");
                } catch (clearError) {
                    console.warn("⚠️ Error limpiando carrito:", clearError);
                    // No fallar por esto, el pago ya fue exitoso
                }
            }
        } catch (error) {
            console.error("❌ Error procesando pago:", error);
            payment?.setError(
                "Error procesando el pago: " + (error as Error).message
            );
        }
    };

    // ============ VALIDACIONES ============

    // Si no está autenticado, mostrar pantalla de carga mientras redirige
    if (!isAuthenticated || !user) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.loadingState}>
                        <div className={classes.loadingSpinner}></div>
                        <p>Verificando autenticación...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ✅ ACTUALIZADO: Si no puede comprar, mostrar mensaje específico
    if (!puedeComprar) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <h2>🛒 Checkout no disponible</h2>
                        <p>
                            Tu rol actual <strong>({user.role})</strong> no está
                            autorizado para realizar pedidos.
                        </p>
                        <div className={classes.suggestions}>
                            <h3>Roles autorizados para comprar:</h3>
                            <ul>
                                <li>
                                    <strong>COMPRADOR</strong> - Usuarios
                                    regulares
                                </li>
                                <li>
                                    <strong>VENDEDOR</strong> - Pueden comprar
                                    productos de otros vendedores
                                </li>
                                <li>
                                    <strong>ADMIN</strong> - Administradores del
                                    sistema
                                </li>
                            </ul>
                        </div>
                        <div className={classes.actions}>
                            <button
                                onClick={() => navigate("/carrito")}
                                className={classes.backButton}
                            >
                                ← Volver al carrito
                            </button>
                            <button
                                onClick={() => navigate("/register")}
                                className={classes.primaryButton}
                            >
                                Crear cuenta autorizada
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Si no hay cart context, mostrar error
    if (!cart) {
        return (
            <div className={classes.checkout}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.errorState}>
                        <h2>❌ Error del sistema</h2>
                        <p>El carrito no está disponible.</p>
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

                {/* Banner de éxito para pago completado */}
                {payment.state.completed && payment.state.orderId && (
                    <div className={classes.successBanner}>
                        <span className={classes.successIcon}>✅</span>
                        <span className={classes.successText}>
                            ¡Pago completado! Número de pedido:{" "}
                            {payment.state.orderId}
                        </span>
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

                    {/* Sidebar con resumen - solo mostrar si no estamos en confirmación */}
                    {payment.state.currentStep !== "confirmation" && (
                        <div className={classes.sidebar}>
                            <div className={classes.orderSummary}>
                                <h3 className={classes.sidebarTitle}>
                                    Resumen del pedido
                                </h3>

                                {payment.state.paymentSummary && (
                                    <>
                                        {/* Items por vendedor */}
                                        {payment.state.paymentSummary.vendorGroups.map(
                                            (group) => (
                                                <div
                                                    key={group.vendor.id}
                                                    className={
                                                        classes.vendorGroup
                                                    }
                                                >
                                                    <h4
                                                        className={
                                                            classes.vendorName
                                                        }
                                                    >
                                                        🏪 {group.vendor.name}
                                                    </h4>
                                                    {group.items.map((item) => (
                                                        <div
                                                            key={
                                                                item.product.id
                                                            }
                                                            className={
                                                                classes.summaryItem
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    classes.itemName
                                                                }
                                                            >
                                                                {
                                                                    item.product
                                                                        .name
                                                                }{" "}
                                                                x{item.quantity}
                                                            </span>
                                                            <span
                                                                className={
                                                                    classes.itemPrice
                                                                }
                                                            >
                                                                {item.totalPrice.toFixed(
                                                                    2
                                                                )}
                                                                €
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )
                                        )}

                                        {/* Totales */}
                                        <div className={classes.totals}>
                                            <div className={classes.totalRow}>
                                                <span>Subtotal:</span>
                                                <span>
                                                    {payment.state.paymentSummary.subtotal.toFixed(
                                                        2
                                                    )}
                                                    €
                                                </span>
                                            </div>
                                            <div className={classes.totalRow}>
                                                <span>Envío:</span>
                                                <span>
                                                    {payment.state.paymentSummary.shippingCost.toFixed(
                                                        2
                                                    )}
                                                    €
                                                </span>
                                            </div>
                                            <div className={classes.totalRow}>
                                                <span>Comisiones:</span>
                                                <span>
                                                    {payment.state.paymentSummary.totalPlatformFees.toFixed(
                                                        2
                                                    )}
                                                    €
                                                </span>
                                            </div>
                                            <div
                                                className={`${classes.totalRow} ${classes.finalTotal}`}
                                            >
                                                <span>Total:</span>
                                                <span>
                                                    {payment.state.paymentSummary.totalAmount.toFixed(
                                                        2
                                                    )}
                                                    €
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

// ✅ COMPONENTE PRINCIPAL que envuelve con PaymentProvider
function Checkout() {
    return (
        <PaymentProvider>
            <CheckoutContent />
        </PaymentProvider>
    );
}

export default Checkout;
