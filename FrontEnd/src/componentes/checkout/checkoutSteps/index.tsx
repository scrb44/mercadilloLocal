// src/componentes/checkout/CheckoutSteps.tsx

import { type PaymentStep } from "../../../types/paymentTypes";
import classes from "./checkoutSteps.module.css";

interface CheckoutStepsProps {
    currentStep: PaymentStep;
    onStepClick?: (step: PaymentStep) => void;
}

function CheckoutSteps({ currentStep, onStepClick }: CheckoutStepsProps) {
    const steps = [
        { id: "cart" as PaymentStep, label: "Carrito", icon: "🛒" },
        { id: "shipping" as PaymentStep, label: "Envío", icon: "📦" },
        { id: "payment" as PaymentStep, label: "Pago", icon: "💳" },
        {
            id: "confirmation" as PaymentStep,
            label: "Confirmación",
            icon: "✅",
        },
    ];

    const getCurrentStepIndex = () =>
        steps.findIndex((step) => step.id === currentStep);
    const currentIndex = getCurrentStepIndex();

    return (
        <div className={classes.checkoutSteps}>
            {steps.map((step, index) => {
                const isActive = step.id === currentStep;
                const isCompleted = index < currentIndex;
                const isClickable =
                    onStepClick && (isCompleted || index <= currentIndex + 1);

                return (
                    <div
                        key={step.id}
                        className={`${classes.step} ${
                            isActive ? classes.active : ""
                        } ${isCompleted ? classes.completed : ""} ${
                            isClickable ? classes.clickable : ""
                        }`}
                        onClick={() => isClickable && onStepClick(step.id)}
                    >
                        <div className={classes.stepIcon}>
                            {isCompleted ? "✓" : step.icon}
                        </div>
                        <div className={classes.stepLabel}>{step.label}</div>
                        {index < steps.length - 1 && (
                            <div
                                className={`${classes.stepConnector} ${
                                    isCompleted
                                        ? classes.connectorCompleted
                                        : ""
                                }`}
                            ></div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default CheckoutSteps;
