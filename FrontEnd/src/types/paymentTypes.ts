// src/types/paymentTypes.ts - Tipos específicos para pagos

import { type ProductInterface, type VendedorInterface } from "./types";

// ============ INTERFACES DE PAGO ============

export interface PaymentMethodInterface {
    id: string;
    type: "card" | "paypal" | "transfer" | "cash";
    name: string;
    icon: string;
    available: boolean;
    processingFee?: number; // Porcentaje de comisión
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status:
        | "requires_payment_method"
        | "requires_confirmation"
        | "requires_action"
        | "processing"
        | "succeeded"
        | "canceled";
    clientSecret?: string;
}

export interface PaymentItem {
    product: ProductInterface;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    vendor: VendedorInterface;
}

// Agrupación de productos por vendedor para pagos separados
export interface VendorPaymentGroup {
    vendor: VendedorInterface;
    items: PaymentItem[];
    subtotal: number;
    platformFee: number; // Comisión de la plataforma
    vendorAmount: number; // Lo que recibe el vendedor
    paymentIntent?: PaymentIntent;
}

export interface PaymentSummary {
    vendorGroups: VendorPaymentGroup[];
    totalItems: number;
    subtotal: number;
    totalPlatformFees: number;
    shippingCost: number;
    totalAmount: number;
    currency: string;
}

export interface ShippingAddress {
    fullName: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    province: string;
    country: string;
}

export interface BillingInfo {
    email: string;
    phone?: string;
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress; // Si es diferente a shipping
    sameAsShipping: boolean;
}

export interface PaymentFormData {
    billingInfo: BillingInfo;
    paymentMethod: string;
    acceptTerms: boolean;
    subscribeNewsletter: boolean;
}

// Estados del proceso de pago
export type PaymentStep = "cart" | "shipping" | "payment" | "confirmation";

export interface PaymentState {
    currentStep: PaymentStep;
    paymentSummary: PaymentSummary | null;
    billingInfo: BillingInfo | null;
    selectedPaymentMethod: string | null;
    processing: boolean;
    error: string | null;
    completed: boolean;
    orderId?: string;
}

// Contexto del proceso de pago
export interface PaymentContextType {
    state: PaymentState;

    // Navegación entre pasos
    goToStep: (step: PaymentStep) => void;
    nextStep: () => void;
    previousStep: () => void;

    // Datos del pago
    initializePayment: (cartItems: PaymentItem[]) => void;
    updateBillingInfo: (info: BillingInfo) => void;
    selectPaymentMethod: (methodId: string) => void;

    // Procesamiento
    processPayment: () => Promise<void>;
    confirmPayment: (paymentData: any) => Promise<void>;

    // Utilidades
    reset: () => void;
    setError: (error: string | null) => void;
}

// ============ CONFIGURACIÓN DE STRIPE ============

export interface StripeConfig {
    publishableKey: string;
    currency: string;
    locale: "es" | "en";
    appearance: {
        theme: "stripe" | "night" | "flat";
        variables: {
            colorPrimary: string;
            colorBackground: string;
            colorText: string;
            fontFamily: string;
        };
    };
}

export interface StripeElementsOptions {
    mode: "payment" | "setup" | "subscription";
    amount: number;
    currency: string;
    appearance: StripeConfig["appearance"];
    locale: StripeConfig["locale"];
}

// ============ TIPOS DE RESPUESTA DE LA API ============

export interface CreatePaymentIntentRequest {
    vendorGroups: Array<{
        vendorId: number;
        items: Array<{
            productId: number;
            quantity: number;
            unitPrice: number;
        }>;
        amount: number; // En centavos
    }>;
    billingInfo: BillingInfo;
    currency: string;
}

export interface CreatePaymentIntentResponse {
    paymentIntents: Array<{
        vendorId: number;
        paymentIntentId: string;
        clientSecret: string;
        amount: number;
    }>;
    totalAmount: number;
    orderId: string;
}

export interface ConfirmPaymentRequest {
    orderId: string;
    paymentIntents: Array<{
        paymentIntentId: string;
        status: string;
    }>;
}

export interface ConfirmPaymentResponse {
    success: boolean;
    orderId: string;
    message: string;
    orderDetails?: {
        items: PaymentItem[];
        totalAmount: number;
        estimatedDelivery: string;
    };
}

// ============ HOOKS ============

export interface UsePaymentReturn {
    // Estado
    state: PaymentState;

    // Métodos de pago disponibles
    paymentMethods: PaymentMethodInterface[];

    // Configuración de Stripe
    stripeConfig: StripeConfig;

    // Acciones
    actions: {
        initializePayment: (cartItems: PaymentItem[]) => void;
        goToStep: (step: PaymentStep) => void;
        nextStep: () => void;
        previousStep: () => void;
        updateBillingInfo: (info: BillingInfo) => void;
        selectPaymentMethod: (methodId: string) => void;
        processPayment: () => Promise<void>;
        reset: () => void;
    };
}

// ============ CONSTANTES ============

export const PAYMENT_METHODS: PaymentMethodInterface[] = [
    {
        id: "stripe_card",
        type: "card",
        name: "Tarjeta de Crédito/Débito",
        icon: "💳",
        available: true,
        processingFee: 2.9, // 2.9% + 0.30€
    },
    {
        id: "paypal",
        type: "paypal",
        name: "PayPal",
        icon: "🅿️",
        available: false, // Para fase 2
        processingFee: 3.4,
    },
    {
        id: "transfer",
        type: "transfer",
        name: "Transferencia Bancaria",
        icon: "🏦",
        available: false, // Para fase 2
        processingFee: 0,
    },
];

export const PLATFORM_FEE_PERCENTAGE = 5; // 5% de comisión de la plataforma

export const SHIPPING_COST = 0; // Gratis por ahora

export const PAYMENT_STEPS: PaymentStep[] = [
    "cart",
    "shipping",
    "payment",
    "confirmation",
];
