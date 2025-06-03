// src/services/paymentService.ts - Servicio para manejar pagos con Stripe

import {
    loadStripe,
    type Stripe,
    type StripeElements,
} from "@stripe/stripe-js";
import {
    type PaymentItem,
    type VendorPaymentGroup,
    type PaymentSummary,
    type BillingInfo,
    type CreatePaymentIntentRequest,
    type CreatePaymentIntentResponse,
    type ConfirmPaymentRequest,
    type ConfirmPaymentResponse,
    type StripeConfig,
    PLATFORM_FEE_PERCENTAGE,
    SHIPPING_COST,
} from "../types/paymentTypes";
import { createApiClient } from "./api";
import { ENDPOINTS } from "../constants";

// ============ CONFIGURACIÓN DE STRIPE ============

const STRIPE_CONFIG: StripeConfig = {
    publishableKey:
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_51...", // Clave de prueba
    currency: "eur",
    locale: "es",
    appearance: {
        theme: "stripe",
        variables: {
            colorPrimary: "#2563eb",
            colorBackground: "#ffffff",
            colorText: "#1f2937",
            fontFamily: "system-ui, sans-serif",
        },
    },
};

let stripePromise: Promise<Stripe | null> | null = null;

export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
    }
    return stripePromise;
};

// ============ UTILIDADES PARA CÁLCULOS ============

export const paymentUtils = {
    /**
     * Agrupa productos del carrito por vendedor
     */
    groupItemsByVendor(items: PaymentItem[]): VendorPaymentGroup[] {
        const vendorMap = new Map<number, VendorPaymentGroup>();

        items.forEach((item) => {
            const vendorId = item.vendor.id;

            if (!vendorMap.has(vendorId)) {
                vendorMap.set(vendorId, {
                    vendor: item.vendor,
                    items: [],
                    subtotal: 0,
                    platformFee: 0,
                    vendorAmount: 0,
                });
            }

            const group = vendorMap.get(vendorId)!;
            group.items.push(item);
        });

        // Calcular totales para cada grupo
        return Array.from(vendorMap.values()).map((group) => {
            const subtotal = group.items.reduce(
                (sum, item) => sum + item.totalPrice,
                0
            );
            const platformFee =
                Math.round(subtotal * (PLATFORM_FEE_PERCENTAGE / 100) * 100) /
                100;
            const vendorAmount = subtotal - platformFee;

            return {
                ...group,
                subtotal,
                platformFee,
                vendorAmount,
            };
        });
    },

    /**
     * Calcula el resumen total del pago
     */
    calculatePaymentSummary(items: PaymentItem[]): PaymentSummary {
        const vendorGroups = this.groupItemsByVendor(items);

        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = vendorGroups.reduce(
            (sum, group) => sum + group.subtotal,
            0
        );
        const totalPlatformFees = vendorGroups.reduce(
            (sum, group) => sum + group.platformFee,
            0
        );
        const totalAmount = subtotal + SHIPPING_COST;

        return {
            vendorGroups,
            totalItems,
            subtotal,
            totalPlatformFees,
            shippingCost: SHIPPING_COST,
            totalAmount,
            currency: STRIPE_CONFIG.currency,
        };
    },

    /**
     * Convierte euros a centavos para Stripe
     */
    eurosToCents(euros: number): number {
        return Math.round(euros * 100);
    },

    /**
     * Convierte centavos a euros
     */
    centsToEuros(cents: number): number {
        return cents / 100;
    },

    /**
     * Formatea precio para mostrar
     */
    formatPrice(amount: number, currency: string = "EUR"): string {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: currency.toUpperCase(),
        }).format(amount);
    },
};

// ============ SERVICIO PRINCIPAL DE PAGOS ============

const apiClient = createApiClient();

export const paymentService = {
    /**
     * Obtiene la configuración de Stripe
     */
    getStripeConfig(): StripeConfig {
        return STRIPE_CONFIG;
    },

    /**
     * Crea PaymentIntents para cada vendedor
     */
    async createPaymentIntents(
        paymentSummary: PaymentSummary,
        billingInfo: BillingInfo
    ): Promise<CreatePaymentIntentResponse> {
        const request: CreatePaymentIntentRequest = {
            vendorGroups: paymentSummary.vendorGroups.map((group) => ({
                vendorId: group.vendor.id,
                items: group.items.map((item) => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: paymentUtils.eurosToCents(item.unitPrice),
                })),
                amount: paymentUtils.eurosToCents(group.subtotal),
            })),
            billingInfo,
            currency: STRIPE_CONFIG.currency,
        };

        try {
            // Intentar usar API real
            const response = await apiClient.post<CreatePaymentIntentResponse>(
                `${ENDPOINTS.PAYMENTS}/create-intent`,
                request
            );
            return response;
        } catch (error) {
            console.warn("🔧 API de pagos no disponible, simulando respuesta");

            // MOCK: Simular respuesta de la API
            return this.mockCreatePaymentIntents(paymentSummary);
        }
    },

    /**
     * Confirma todos los pagos y crea la orden
     */
    async confirmPayments(
        orderId: string,
        paymentResults: Array<{
            vendorId: number;
            paymentIntentId: string;
            status: string;
        }>
    ): Promise<ConfirmPaymentResponse> {
        const request: ConfirmPaymentRequest = {
            orderId,
            paymentIntents: paymentResults.map((result) => ({
                paymentIntentId: result.paymentIntentId,
                status: result.status,
            })),
        };

        try {
            // Intentar usar API real
            const response = await apiClient.post<ConfirmPaymentResponse>(
                `${ENDPOINTS.PAYMENTS}/confirm`,
                request
            );
            return response;
        } catch (error) {
            console.warn(
                "🔧 API de pagos no disponible, simulando confirmación"
            );

            // MOCK: Simular confirmación exitosa
            return {
                success: true,
                orderId,
                message: "¡Pago procesado exitosamente! (Simulación)",
                orderDetails: {
                    items: [], // Se llenaría con los datos reales
                    totalAmount: 0,
                    estimatedDelivery: new Date(
                        Date.now() + 3 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString("es-ES"),
                },
            };
        }
    },

    /**
     * Procesa el pago con Stripe Elements
     */
    async processStripePayment(
        stripe: Stripe,
        elements: StripeElements,
        clientSecret: string
    ): Promise<{ success: boolean; error?: string; paymentIntent?: any }> {
        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/pago/confirmacion`,
                },
                redirect: "if_required",
            });

            if (error) {
                return {
                    success: false,
                    error: error.message || "Error procesando el pago",
                };
            }

            return {
                success: true,
                paymentIntent,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || "Error inesperado en el pago",
            };
        }
    },

    /**
     * Cancela un PaymentIntent
     */
    async cancelPaymentIntent(paymentIntentId: string): Promise<void> {
        try {
            await apiClient.post(`${ENDPOINTS.PAYMENTS}/cancel`, {
                paymentIntentId,
            });
        } catch (error) {
            console.warn("🔧 No se pudo cancelar el PaymentIntent:", error);
        }
    },

    // ============ MÉTODOS MOCK PARA DESARROLLO ============

    /**
     * MOCK: Simula la creación de PaymentIntents
     */
    async mockCreatePaymentIntents(
        paymentSummary: PaymentSummary
    ): Promise<CreatePaymentIntentResponse> {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const orderId = `order_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`;

        const paymentIntents = paymentSummary.vendorGroups.map(
            (group, index) => ({
                vendorId: group.vendor.id,
                paymentIntentId: `pi_mock_${Date.now()}_${index}`,
                clientSecret: `pi_mock_${Date.now()}_${index}_secret_mock`,
                amount: paymentUtils.eurosToCents(group.subtotal),
            })
        );

        return {
            paymentIntents,
            totalAmount: paymentUtils.eurosToCents(paymentSummary.totalAmount),
            orderId,
        };
    },

    /**
     * MOCK: Simula el procesamiento exitoso de un pago
     */
    async mockProcessPayment(): Promise<{
        success: boolean;
        paymentIntent: any;
    }> {
        // Simular procesamiento
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            success: true,
            paymentIntent: {
                id: `pi_mock_${Date.now()}`,
                status: "succeeded",
                amount: 0,
                currency: "eur",
            },
        };
    },
};

// ============ EXPORTACIONES ============

export { STRIPE_CONFIG };
export default paymentService;
