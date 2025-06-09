// src/contexts/paymentContext.tsx - Versión simplificada sin dependencias de hooks

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
    type UserPaymentData, // ✅ AGREGADO
    PAYMENT_STEPS,
} from "../types/paymentTypes";
import { paymentUtils } from "../services/paymentService";
import {
    pedidosService,
    type CrearPedidoRequest,
    type ProductoPedido,
} from "../services/pedidosService";

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

const PaymentContext = createContext<PaymentContextType | null>(null);

// ============ PROVIDER ============

interface PaymentProviderProps {
    children: ReactNode;
}

export function PaymentProvider({ children }: PaymentProviderProps) {
    const [state, dispatch] = useReducer(paymentReducer, initialState);

    // ============ UTILIDADES ============

    const convertToPaymentItems = useCallback(
        (cartItems: PaymentItem[]): PaymentItem[] => {
            return cartItems.map((item) => ({
                product: item.product,
                quantity: item.quantity,
                unitPrice: item.product.price,
                totalPrice: item.product.price * item.quantity,
                vendor: item.product.vendedor,
            }));
        },
        []
    );

    const convertToProductoPedido = useCallback(
        (paymentItems: PaymentItem[]): ProductoPedido[] => {
            return paymentItems.map((item) => ({
                id: item.product.id,
                nombre: item.product.name,
                precio: item.product.price,
                cantidad: item.quantity,
                imagen: item.product.img?.[0] || undefined,
            }));
        },
        []
    );

    // ============ ACCIONES ============

    const goToStep = useCallback((step: PaymentStep) => {
        dispatch({ type: "SET_STEP", payload: step });
    }, []);

    const nextStep = useCallback(() => {
        const currentIndex = PAYMENT_STEPS.indexOf(state.currentStep);
        if (currentIndex < PAYMENT_STEPS.length - 1) {
            dispatch({
                type: "SET_STEP",
                payload: PAYMENT_STEPS[currentIndex + 1],
            });
        }
    }, [state.currentStep]);

    const previousStep = useCallback(() => {
        const currentIndex = PAYMENT_STEPS.indexOf(state.currentStep);
        if (currentIndex > 0) {
            dispatch({
                type: "SET_STEP",
                payload: PAYMENT_STEPS[currentIndex - 1],
            });
        }
    }, [state.currentStep]);

    const initializePayment = useCallback(
        (cartItems: PaymentItem[]) => {
            try {
                // Convertir los items del carrito al formato correcto
                const paymentItems = convertToPaymentItems(cartItems);

                // Crear el resumen de pago
                const paymentSummary =
                    paymentUtils.calculatePaymentSummary(paymentItems);

                dispatch({
                    type: "INITIALIZE_PAYMENT",
                    payload: paymentSummary,
                });
            } catch (error) {
                console.error("❌ Error inicializando pago:", error);
                dispatch({
                    type: "SET_ERROR",
                    payload:
                        "Error inicializando el pago: " +
                        (error as Error).message,
                });
            }
        },
        [convertToPaymentItems]
    );

    const updateBillingInfo = useCallback((info: BillingInfo) => {
        dispatch({ type: "SET_BILLING_INFO", payload: info });
    }, []);

    const selectPaymentMethod = useCallback((methodId: string) => {
        dispatch({ type: "SELECT_PAYMENT_METHOD", payload: methodId });
    }, []);

    // ✅ CORREGIDO: processPayment ahora tiene el tipo correcto
    const processPayment = useCallback(
        async (userData: UserPaymentData) => {
            if (!state.paymentSummary || !state.billingInfo) {
                dispatch({
                    type: "SET_ERROR",
                    payload: "Faltan datos para procesar el pago",
                });
                return null;
            }

            dispatch({ type: "SET_PROCESSING", payload: true });

            try {
                // ✅ VALIDACIÓN: Asegurar que tenemos email
                if (!userData.email || typeof userData.email !== "string") {
                    throw new Error(
                        `Email del usuario no es válido: ${userData.email}`
                    );
                }

                // Obtener todos los items del resumen de pago
                const allItems: PaymentItem[] = [];
                state.paymentSummary.vendorGroups.forEach((group) => {
                    allItems.push(...group.items);
                });

                // Convertir los items de pago a productos de pedido
                const productos = convertToProductoPedido(allItems);

                // Preparar la request para crear el pedido
                const pedidoRequest: CrearPedidoRequest = {
                    total: state.paymentSummary.totalAmount,
                    tipoComprador: userData.role,
                    compradorId: 0, // ✅ TEMPORAL: Mantener por compatibilidad, pero no se usará
                    compradorNombre: userData.nombre,
                    compradorEmail: userData.email, // ✅ PRINCIPAL: Email como identificador único
                    cantidadProductos: state.paymentSummary.totalItems,
                    direccionEntrega:
                        state.billingInfo.shippingAddress.address1,
                    ciudadEntrega: state.billingInfo.shippingAddress.city,
                    codigoPostalEntrega:
                        state.billingInfo.shippingAddress.postalCode,
                    telefonoEntrega: state.billingInfo.phone,
                    productos: productos,
                };

                // ✅ DEBUGGING: Verificar token antes de enviar
                await pedidosService.debugToken();

                // Llamar al servicio de pedidos para crear el pedido
                const pedidoCreado = await pedidosService.crearPedido(
                    pedidoRequest
                );

                // Marcar como completado
                dispatch({
                    type: "SET_COMPLETED",
                    payload: { orderId: pedidoCreado.numeroPedido },
                });

                return pedidoCreado;
            } catch (error) {
                console.error("❌ Error procesando pago:", error);
                dispatch({
                    type: "SET_ERROR",
                    payload:
                        (error as Error).message || "Error procesando el pago",
                });
                return null;
            }
        },
        [state.paymentSummary, state.billingInfo, convertToProductoPedido]
    );

    const confirmPayment = useCallback(async (paymentData: any) => {
        // Esta función se mantiene para compatibilidad
        return null;
    }, []);

    const reset = useCallback(() => {
        dispatch({ type: "RESET" });
    }, []);

    const setError = useCallback((error: string | null) => {
        dispatch({ type: "SET_ERROR", payload: error });
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
}

// ============ HOOK ============

export function usePayment(): PaymentContextType {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error("usePayment debe usarse dentro de PaymentProvider");
    }
    return context;
}

export default PaymentContext;
