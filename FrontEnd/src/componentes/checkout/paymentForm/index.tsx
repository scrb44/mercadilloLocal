// src/componentes/checkout/PaymentForm.tsx

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

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedPaymentMethod) {
            alert("Por favor, selecciona un método de pago");
            return;
        }

        if (!acceptTerms) {
            alert("Debes aceptar los términos y condiciones");
            return;
        }

        onProcessPayment();
    };

    return (
        <div className={classes.paymentForm}>
            <h2 className={classes.title}>Método de pago</h2>

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
                                        className={classes.radio}
                                    />
                                    <div className={classes.methodInfo}>
                                        <div className={classes.methodHeader}>
                                            <span
                                                className={classes.methodIcon}
                                            >
                                                {method.icon}
                                            </span>
                                            <span
                                                className={classes.methodName}
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
                                            method.processingFee > 0 && (
                                                <div
                                                    className={
                                                        classes.methodFee
                                                    }
                                                >
                                                    Comisión:{" "}
                                                    {method.processingFee}%
                                                </div>
                                            )}
                                    </div>
                                </label>

                                {/* Formulario específico para tarjeta */}
                                {selectedPaymentMethod === method.id &&
                                    method.id === "stripe_card" && (
                                        <div className={classes.cardForm}>
                                            <div className={classes.cardNotice}>
                                                <div
                                                    className={
                                                        classes.noticeIcon
                                                    }
                                                >
                                                    ℹ️
                                                </div>
                                                <div
                                                    className={
                                                        classes.noticeText
                                                    }
                                                >
                                                    <strong>
                                                        Modo de prueba activado
                                                    </strong>
                                                    <br />
                                                    Puedes usar la tarjeta de
                                                    prueba: 4242 4242 4242 4242
                                                    <br />
                                                    Cualquier fecha futura y CVC
                                                    (123)
                                                </div>
                                            </div>

                                            {/* Aquí iría el Stripe Elements cuando se integre completamente */}
                                            <div
                                                className={
                                                    classes.mockCardInput
                                                }
                                            >
                                                <input
                                                    type="text"
                                                    placeholder="4242 4242 4242 4242"
                                                    className={
                                                        classes.cardInput
                                                    }
                                                    disabled={loading}
                                                />
                                                <div
                                                    className={classes.cardRow}
                                                >
                                                    <input
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        className={
                                                            classes.cardInput
                                                        }
                                                        disabled={loading}
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="CVC"
                                                        className={
                                                            classes.cardInput
                                                        }
                                                        disabled={loading}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Resumen del pedido */}
                {paymentSummary && (
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>
                            Resumen del pago
                        </h3>

                        <div className={classes.paymentBreakdown}>
                            <div className={classes.breakdownRow}>
                                <span>
                                    Productos ({paymentSummary.totalItems}):
                                </span>
                                <span>
                                    {paymentUtils.formatPrice(
                                        paymentSummary.subtotal
                                    )}
                                </span>
                            </div>
                            <div className={classes.breakdownRow}>
                                <span>Envío:</span>
                                <span>
                                    {paymentSummary.shippingCost === 0
                                        ? "Gratis"
                                        : paymentUtils.formatPrice(
                                              paymentSummary.shippingCost
                                          )}
                                </span>
                            </div>
                            <div className={classes.breakdownDivider}></div>
                            <div className={classes.breakdownTotal}>
                                <span>Total a pagar:</span>
                                <span>
                                    {paymentUtils.formatPrice(
                                        paymentSummary.totalAmount
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Información de envío */}
                {billingInfo && (
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>Envío a:</h3>
                        <div className={classes.shippingInfo}>
                            <div className={classes.shippingName}>
                                {billingInfo.shippingAddress.fullName}
                            </div>
                            <div className={classes.shippingAddress}>
                                {billingInfo.shippingAddress.address1}
                                {billingInfo.shippingAddress.address2 &&
                                    `, ${billingInfo.shippingAddress.address2}`}
                            </div>
                            <div className={classes.shippingCity}>
                                {billingInfo.shippingAddress.postalCode}{" "}
                                {billingInfo.shippingAddress.city}
                            </div>
                        </div>
                    </div>
                )}

                {/* Términos y condiciones */}
                <div className={classes.section}>
                    <label className={classes.checkboxContainer}>
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                            className={classes.checkbox}
                            disabled={loading}
                        />
                        <span className={classes.checkboxLabel}>
                            Acepto los{" "}
                            <a
                                href="/terminos"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                términos y condiciones
                            </a>{" "}
                            y la{" "}
                            <a
                                href="/privacidad"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                política de privacidad
                            </a>
                        </span>
                    </label>
                </div>

                <div className={classes.actions}>
                    <button
                        type="button"
                        onClick={onBack}
                        className={classes.secondaryButton}
                        disabled={loading}
                    >
                        ← Volver
                    </button>
                    <button
                        type="submit"
                        className={classes.primaryButton}
                        disabled={
                            loading || !selectedPaymentMethod || !acceptTerms
                        }
                    >
                        {loading ? (
                            <>
                                <span className={classes.spinner}></span>
                                Procesando pago...
                            </>
                        ) : (
                            `Pagar ${
                                paymentSummary
                                    ? paymentUtils.formatPrice(
                                          paymentSummary.totalAmount
                                      )
                                    : ""
                            }`
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PaymentForm;
