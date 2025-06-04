// src/contexts/paymentContext.tsx - Contexto para manejar el proceso de pago

import React, {
    createContext,
    useContext,
    useReducer,
    useCallback,
    type ReactNode,
} from "react";
import {
    type PaymentState,
    type PaymentContextType,
    type PaymentStep,
    type PaymentItem,
    type BillingInfo,
    type PaymentSummary,
    PAYMENT_STEPS,
} from "../types/paymentTypes";
import { paymentService, paymentUtils } from "../services/paymentService";
import { useCart } from "./cartContext";

// ============ ESTADO INICIAL ============

const initialState: PaymentState = {
    currentStep: "cart",
    paymentSummary: null,
    billingInfo: null,
    selectedPaymentMethod: null,
    processing: false,
    error: null,
    completed: false,
    orderId: undefined,
};

// ============ ACTIONS ============

type PaymentAction =
    | { type: "SET_STEP"; payload: PaymentStep }
    | { type: "INITIALIZE_PAYMENT"; payload: PaymentSummary }
    | { type: "SET_BILLING_INFO"; payload: BillingInfo }
    | { type: "SELECT_PAYMENT_METHOD"; payload: string }
    | { type: "SET_PROCESSING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_COMPLETED"; payload: { orderId: string } }
    | { type: "RESET" };

// ============ REDUCER ============

function paymentReducer(
    state: PaymentState,
    action: PaymentAction
): PaymentState {
    switch (action.type) {
        case "SET_STEP":
            return { ...state, currentStep: action.payload, error: null };

        case "INITIALIZE_PAYMENT":
            return {
                ...state,
                paymentSummary: action.payload,
                currentStep: "shipping",
                error: null,
            };

        case "SET_BILLING_INFO":
            return { ...state, billingInfo: action.payload, error: null };

        case "SELECT_PAYMENT_METHOD":
            return {
                ...state,
                selectedPaymentMethod: action.payload,
                error: null,
            };

        case "SET_PROCESSING":
            return { ...state, processing: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload, processing: false };

        case "SET_COMPLETED":
            return {
                ...state,
                completed: true,
                orderId: action.payload.orderId,
                currentStep: "confirmation",
                processing: false,
                error: null,
            };

        case "RESET":
            return initialState;

        default:
            return state;
    }
}

// ============ CONTEXT ============

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// ============ PROVIDER ============

interface PaymentProviderProps {
    children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
    children,
}) => {
    const [state, dispatch] = useReducer(paymentReducer, initialState);
    const cart = useCart();

    // ============ NAVEGACIÓN ENTRE PASOS ============

    const goToStep = useCallback((step: PaymentStep) => {
        dispatch({ type: "SET_STEP", payload: step });
    }, []);

    const nextStep = useCallback(() => {
        const currentIndex = PAYMENT_STEPS.indexOf(state.currentStep);
        if (currentIndex < PAYMENT_STEPS.length - 1) {
            const nextStep = PAYMENT_STEPS[currentIndex + 1];
            dispatch({ type: "SET_STEP", payload: nextStep });
        }
    }, [state.currentStep]);

    const previousStep = useCallback(() => {
        const currentIndex = PAYMENT_STEPS.indexOf(state.currentStep);
        if (currentIndex > 0) {
            const prevStep = PAYMENT_STEPS[currentIndex - 1];
            dispatch({ type: "SET_STEP", payload: prevStep });
        }
    }, [state.currentStep]);

    // ============ INICIALIZACIÓN DEL PAGO ============

    const initializePayment = useCallback(
        (cartItems?: PaymentItem[]) => {
            try {
                console.log("🔧 initializePayment llamado con:", {
                    cartItemsProvided: !!cartItems,
                    cartItemsLength: cartItems?.length,
                    contextCartItems: cart.items.length,
                });

                // Convertir items del carrito a PaymentItems si no se proporcionan
                const items =
                    cartItems ||
                    cart.items.map((item) => ({
                        product: item.product,
                        quantity: item.quantity,
                        unitPrice: item.product.price,
                        totalPrice: item.product.price * item.quantity,
                        vendor: item.product.vendedor,
                    }));

                console.log("🔧 Items para el pago:", items);

                if (items.length === 0) {
                    dispatch({
                        type: "SET_ERROR",
                        payload: "No hay productos en el carrito",
                    });
                    return;
                }

                const paymentSummary =
                    paymentUtils.calculatePaymentSummary(items);
                console.log("🔧 Payment summary calculado:", paymentSummary);

                dispatch({
                    type: "INITIALIZE_PAYMENT",
                    payload: paymentSummary,
                });
            } catch (error: any) {
                console.error("❌ Error en initializePayment:", error);
                dispatch({
                    type: "SET_ERROR",
                    payload: error.message || "Error inicializando el pago",
                });
            }
        },
        [cart.items]
    );

    // ============ GESTIÓN DE DATOS ============

    const updateBillingInfo = useCallback((info: BillingInfo) => {
        dispatch({ type: "SET_BILLING_INFO", payload: info });
    }, []);

    const selectPaymentMethod = useCallback((methodId: string) => {
        dispatch({ type: "SELECT_PAYMENT_METHOD", payload: methodId });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: "SET_ERROR", payload: error });
    }, []);

    // ============ PROCESAMIENTO DEL PAGO ============

    const processPayment = useCallback(async () => {
        if (
            !state.paymentSummary ||
            !state.billingInfo ||
            !state.selectedPaymentMethod
        ) {
            dispatch({
                type: "SET_ERROR",
                payload: "Faltan datos para procesar el pago",
            });
            return;
        }

        dispatch({ type: "SET_PROCESSING", payload: true });

        try {
            // Crear PaymentIntents para cada vendedor
            const response = await paymentService.createPaymentIntents(
                state.paymentSummary,
                state.billingInfo
            );

            // En un caso real, aquí procesarías cada PaymentIntent con Stripe
            // Por ahora, simularemos que todos los pagos son exitosos
            console.log("🔧 PaymentIntents creados (simulado):", response);

            // Simular procesamiento de pagos
            const paymentResults = response.paymentIntents.map((intent) => ({
                vendorId: intent.vendorId,
                paymentIntentId: intent.paymentIntentId,
                status: "succeeded",
            }));

            // Confirmar pagos con el backend
            const confirmResponse = await paymentService.confirmPayments(
                response.orderId,
                paymentResults
            );

            if (confirmResponse.success) {
                // Marcar como completado ANTES de limpiar el carrito
                dispatch({
                    type: "SET_COMPLETED",
                    payload: { orderId: confirmResponse.orderId },
                });

                // Limpiar carrito después del pago exitoso (pero mantenemos el contexto de pago)
                await cart.clearCart();

                console.log(
                    "✅ Pago completado exitosamente. Orden:",
                    confirmResponse.orderId
                );
            } else {
                throw new Error(
                    confirmResponse.message || "Error confirmando el pago"
                );
            }
        } catch (error: any) {
            dispatch({
                type: "SET_ERROR",
                payload: error.message || "Error procesando el pago",
            });
        }
    }, [
        state.paymentSummary,
        state.billingInfo,
        state.selectedPaymentMethod,
        cart,
    ]);

    // ============ CONFIRMACIÓN ESPECÍFICA DE STRIPE ============

    const confirmPayment = useCallback(
        async (paymentData: any) => {
            // Esta función se usaría cuando integremos Stripe Elements completamente
            // Por ahora, redirige a processPayment
            await processPayment();
        },
        [processPayment]
    );

    // ============ RESET ============

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    // ============ VALOR DEL CONTEXTO ============

    const contextValue: PaymentContextType = {
        state,
        goToStep,
        nextStep,
        previousStep,
        initializePayment,
        updateBillingInfo,
        selectPaymentMethod,
        processPayment,
        confirmPayment,
        reset,
        setError,
    };

    return (
        <PaymentContext.Provider value={contextValue}>
            {children}
        </PaymentContext.Provider>
    );
};

// ============ HOOK ============

export const usePayment = (): PaymentContextType => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error("usePayment must be used within a PaymentProvider");
    }
    return context;
};

export default PaymentContext;
