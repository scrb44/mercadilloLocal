// src/componentes/checkout/PaymentForm.tsx - ACTUALIZADO con mejor manejo de estados

import { useState } from "react";
import {
    type PaymentSummary,
    type BillingInfo,
    PAYMENT_METHODS,
} from "../../../types/paymentTypes";
import { paymentUtils } from "../../../services/paymentService";
import classes from "./paymentForm.module.css";

interface PaymentFormProps {
    paymentSummary: PaymentSummary | null;
    billingInfo: BillingInfo | null;
    selectedPaymentMethod: string | null;
    onSelectPaymentMethod: (methodId: string) => void;
    onProcessPayment: () => void;
    onBack: () => void;
    loading: boolean;
}

function PaymentForm({
    paymentSummary,
    billingInfo,
    selectedPaymentMethod,
    onSelectPaymentMethod,
    onProcessPayment,
    onBack,
    loading,
}: PaymentFormProps) {
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
    const [processingError, setProcessingError] = useState<string | null>(null);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessingError(null);

        // Validaciones
        if (!selectedPaymentMethod) {
            setProcessingError("Por favor, selecciona un método de pago");
            return;
        }

        if (!acceptTerms) {
            setProcessingError(
                "Debes aceptar los términos y condiciones para continuar"
            );
            return;
        }

        if (!paymentSummary) {
            setProcessingError("Error: No se encontró el resumen del pedido");
            return;
        }

        if (!billingInfo) {
            setProcessingError("Error: No se encontró la información de envío");
            return;
        }

        // Procesar el pago
        try {
            await onProcessPayment();
        } catch (error) {
            setProcessingError(
                (error as Error).message || "Error procesando el pago"
            );
        }
    };

    // Calcular resumen financiero
    const financialSummary = paymentSummary
        ? {
              subtotal: paymentSummary.subtotal,
              platformFees: paymentSummary.totalPlatformFees,
              shipping: paymentSummary.shippingCost,
              total: paymentSummary.totalAmount,
          }
        : null;

    return (
        <div className={classes.paymentForm}>
            <h2 className={classes.title}>Método de pago</h2>

            {/* Banner de error específico del formulario */}
            {processingError && (
                <div className={classes.errorBanner}>
                    <span className={classes.errorIcon}>⚠️</span>
                    <span className={classes.errorText}>{processingError}</span>
                    <button
                        onClick={() => setProcessingError(null)}
                        className={classes.dismissError}
                    >
                        ✕
                    </button>
                </div>
            )}

            <form onSubmit={handlePaymentSubmit} className={classes.form}>
                {/* Métodos de pago */}
                <div className={classes.section}>
                    <h3 className={classes.sectionTitle}>
                        Selecciona tu método de pago
                    </h3>

                    <div className={classes.paymentMethods}>
                        {PAYMENT_METHODS.map((method) => (
                            <div
                                key={method.id}
                                className={classes.paymentMethodContainer}
                            >
                                <label
                                    className={`${classes.paymentMethod} ${
                                        selectedPaymentMethod === method.id
                                            ? classes.selected
                                            : ""
                                    } ${
                                        !method.available
                                            ? classes.disabled
                                            : ""
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={
                                            selectedPaymentMethod === method.id
                                        }
                                        onChange={(e) =>
                                            onSelectPaymentMethod(
                                                e.target.value
                                            )
                                        }
                                        disabled={!method.available || loading}
                                        className={classes.paymentRadio}
                                    />
                                    <div className={classes.paymentInfo}>
                                        <div className={classes.paymentHeader}>
                                            <span
                                                className={classes.paymentIcon}
                                            >
                                                {method.icon}
                                            </span>
                                            <span
                                                className={classes.paymentName}
                                            >
                                                {method.name}
                                            </span>
                                            {!method.available && (
                                                <span
                                                    className={
                                                        classes.comingSoon
                                                    }
                                                >
                                                    Próximamente
                                                </span>
                                            )}
                                        </div>
                                        {method.processingFee &&
                                            method.available && (
                                                <div
                                                    className={
                                                        classes.processingFee
                                                    }
                                                >
                                                    Comisión:{" "}
                                                    {method.processingFee}%
                                                </div>
                                            )}
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>

                    {/* Información adicional del método seleccionado */}
                    {selectedPaymentMethod === "stripe_card" && (
                        <div className={classes.paymentDetails}>
                            <div className={classes.cardInfo}>
                                <h4>💳 Pago con tarjeta</h4>
                                <p>
                                    Tu pago se procesará de forma segura
                                    mediante Stripe. Los datos de tu tarjeta
                                    están protegidos con cifrado de nivel
                                    bancario.
                                </p>
                                <div className={classes.securityBadges}>
                                    <span className={classes.badge}>
                                        🔒 SSL
                                    </span>
                                    <span className={classes.badge}>
                                        🛡️ PCI DSS
                                    </span>
                                    <span className={classes.badge}>
                                        ✅ Verificado
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Resumen financiero */}
                {financialSummary && (
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>
                            Resumen del pago
                        </h3>
                        <div className={classes.financialSummary}>
                            <div className={classes.summaryRow}>
                                <span>Subtotal productos:</span>
                                <span>
                                    {financialSummary.subtotal.toFixed(2)}€
                                </span>
                            </div>
                            <div className={classes.summaryRow}>
                                <span>Gastos de envío:</span>
                                <span>
                                    {financialSummary.shipping === 0
                                        ? "GRATIS"
                                        : `${financialSummary.shipping.toFixed(
                                              2
                                          )}€`}
                                </span>
                            </div>
                            <div className={classes.summaryRow}>
                                <span>Comisiones de servicio:</span>
                                <span>
                                    {financialSummary.platformFees.toFixed(2)}€
                                </span>
                            </div>
                            <div
                                className={`${classes.summaryRow} ${classes.total}`}
                            >
                                <span>Total a pagar:</span>
                                <span>
                                    {financialSummary.total.toFixed(2)}€
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Información de envío confirmada */}
                {billingInfo && (
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>
                            Dirección de envío
                        </h3>
                        <div className={classes.shippingConfirmation}>
                            <div className={classes.shippingDetails}>
                                <strong>
                                    {billingInfo.shippingAddress.fullName}
                                </strong>
                                <br />
                                {billingInfo.shippingAddress.address1}
                                <br />
                                {billingInfo.shippingAddress.address2 && (
                                    <>
                                        {billingInfo.shippingAddress.address2}
                                        <br />
                                    </>
                                )}
                                {billingInfo.shippingAddress.postalCode}{" "}
                                {billingInfo.shippingAddress.city}
                                <br />
                                {billingInfo.shippingAddress.province},{" "}
                                {billingInfo.shippingAddress.country}
                                {billingInfo.phone && (
                                    <>
                                        <br />
                                        Tel: {billingInfo.phone}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Términos y condiciones */}
                <div className={classes.section}>
                    <div className={classes.checkboxGroup}>
                        <label className={classes.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={(e) =>
                                    setAcceptTerms(e.target.checked)
                                }
                                disabled={loading}
                                className={classes.checkbox}
                            />
                            <span className={classes.checkboxText}>
                                Acepto los{" "}
                                <a
                                    href="/terminos"
                                    target="_blank"
                                    className={classes.link}
                                >
                                    términos y condiciones
                                </a>{" "}
                                y la{" "}
                                <a
                                    href="/privacidad"
                                    target="_blank"
                                    className={classes.link}
                                >
                                    política de privacidad
                                </a>
                            </span>
                        </label>

                        <label className={classes.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={subscribeNewsletter}
                                onChange={(e) =>
                                    setSubscribeNewsletter(e.target.checked)
                                }
                                disabled={loading}
                                className={classes.checkbox}
                            />
                            <span className={classes.checkboxText}>
                                Quiero recibir ofertas y novedades por email
                                (opcional)
                            </span>
                        </label>
                    </div>
                </div>

                {/* Botones de acción */}
                <div className={classes.actions}>
                    <button
                        type="button"
                        onClick={onBack}
                        disabled={loading}
                        className={classes.backButton}
                    >
                        ← Volver a envío
                    </button>

                    <button
                        type="submit"
                        disabled={
                            loading || !acceptTerms || !selectedPaymentMethod
                        }
                        className={classes.submitButton}
                    >
                        {loading ? (
                            <>
                                <span className={classes.loadingSpinner}></span>
                                Procesando pago...
                            </>
                        ) : (
                            <>🔒 Pagar {financialSummary?.total.toFixed(2)}€</>
                        )}
                    </button>
                </div>

                {/* Información de seguridad */}
                <div className={classes.securityInfo}>
                    <p className={classes.securityText}>
                        🔒 Tu información está protegida. No almacenamos datos
                        de tarjetas de crédito.
                    </p>
                </div>
            </form>
        </div>
    );
}

export default PaymentForm;
