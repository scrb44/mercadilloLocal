// src/componentes/checkout/ShippingForm.tsx

import { useState, useEffect } from "react";
import {
    type BillingInfo,
    type ShippingAddress,
} from "../../../types/paymentTypes";
import { useMunicipio } from "../../../contexts/municipioContext";
import classes from "./shippingForm.module.css";

interface ShippingFormProps {
    billingInfo: BillingInfo | null;
    onUpdateBillingInfo: (info: BillingInfo) => void;
    onContinue: () => void;
    onBack: () => void;
    loading: boolean;
}

function ShippingForm({
    billingInfo,
    onUpdateBillingInfo,
    onContinue,
    onBack,
    loading,
}: ShippingFormProps) {
    const { municipio } = useMunicipio();

    const [formData, setFormData] = useState<BillingInfo>({
        email: billingInfo?.email || "",
        phone: billingInfo?.phone || "",
        shippingAddress: billingInfo?.shippingAddress || {
            fullName: "",
            address1: "",
            address2: "",
            city: municipio?.nombre || "",
            postalCode: "",
            province: "Málaga",
            country: "España",
        },
        sameAsShipping: billingInfo?.sameAsShipping ?? true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (municipio && !formData.shippingAddress.city) {
            setFormData((prev) => ({
                ...prev,
                shippingAddress: {
                    ...prev.shippingAddress,
                    city: municipio.nombre,
                },
            }));
        }
    }, [municipio]);

    const handleInputChange = (field: string, value: string) => {
        if (field.startsWith("shippingAddress.")) {
            const addressField = field.replace("shippingAddress.", "");
            setFormData((prev) => ({
                ...prev,
                shippingAddress: {
                    ...prev.shippingAddress,
                    [addressField]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }

        // Limpiar error del campo
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
            newErrors.email = "El email es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email no válido";
        }

        if (!formData.shippingAddress.fullName) {
            newErrors["shippingAddress.fullName"] =
                "El nombre completo es obligatorio";
        }

        if (!formData.shippingAddress.address1) {
            newErrors["shippingAddress.address1"] =
                "La dirección es obligatoria";
        }

        if (!formData.shippingAddress.postalCode) {
            newErrors["shippingAddress.postalCode"] =
                "El código postal es obligatorio";
        } else if (!/^\d{5}$/.test(formData.shippingAddress.postalCode)) {
            newErrors["shippingAddress.postalCode"] =
                "Código postal inválido (5 dígitos)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onUpdateBillingInfo(formData);
            onContinue();
        }
    };

    return (
        <div className={classes.shippingForm}>
            <h2 className={classes.title}>Información de envío</h2>

            <form onSubmit={handleSubmit} className={classes.form}>
                {/* Información de contacto */}
                <div className={classes.section}>
                    <h3 className={classes.sectionTitle}>Contacto</h3>

                    <div className={classes.formRow}>
                        <div className={classes.inputGroup}>
                            <label className={classes.label}>Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) =>
                                    handleInputChange("email", e.target.value)
                                }
                                className={`${classes.input} ${
                                    errors.email ? classes.inputError : ""
                                }`}
                                placeholder="tu@email.com"
                                disabled={loading}
                            />
                            {errors.email && (
                                <span className={classes.error}>
                                    {errors.email}
                                </span>
                            )}
                        </div>

                        <div className={classes.inputGroup}>
                            <label className={classes.label}>Teléfono</label>
                            <input
                                type="tel"
                                value={formData.phone || ""}
                                onChange={(e) =>
                                    handleInputChange("phone", e.target.value)
                                }
                                className={classes.input}
                                placeholder="123 456 789"
                                disabled={loading}
                            />
                        </div>
                    </div>
                </div>

                {/* Dirección de envío */}
                <div className={classes.section}>
                    <h3 className={classes.sectionTitle}>Dirección de envío</h3>

                    <div className={classes.inputGroup}>
                        <label className={classes.label}>
                            Nombre completo *
                        </label>
                        <input
                            type="text"
                            value={formData.shippingAddress.fullName}
                            onChange={(e) =>
                                handleInputChange(
                                    "shippingAddress.fullName",
                                    e.target.value
                                )
                            }
                            className={`${classes.input} ${
                                errors["shippingAddress.fullName"]
                                    ? classes.inputError
                                    : ""
                            }`}
                            placeholder="Juan Pérez"
                            disabled={loading}
                        />
                        {errors["shippingAddress.fullName"] && (
                            <span className={classes.error}>
                                {errors["shippingAddress.fullName"]}
                            </span>
                        )}
                    </div>

                    <div className={classes.inputGroup}>
                        <label className={classes.label}>Dirección *</label>
                        <input
                            type="text"
                            value={formData.shippingAddress.address1}
                            onChange={(e) =>
                                handleInputChange(
                                    "shippingAddress.address1",
                                    e.target.value
                                )
                            }
                            className={`${classes.input} ${
                                errors["shippingAddress.address1"]
                                    ? classes.inputError
                                    : ""
                            }`}
                            placeholder="Calle Principal, 123"
                            disabled={loading}
                        />
                        {errors["shippingAddress.address1"] && (
                            <span className={classes.error}>
                                {errors["shippingAddress.address1"]}
                            </span>
                        )}
                    </div>

                    <div className={classes.inputGroup}>
                        <label className={classes.label}>
                            Dirección 2 (opcional)
                        </label>
                        <input
                            type="text"
                            value={formData.shippingAddress.address2 || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "shippingAddress.address2",
                                    e.target.value
                                )
                            }
                            className={classes.input}
                            placeholder="Piso, puerta..."
                            disabled={loading}
                        />
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.inputGroup}>
                            <label className={classes.label}>Ciudad *</label>
                            <input
                                type="text"
                                value={formData.shippingAddress.city}
                                onChange={(e) =>
                                    handleInputChange(
                                        "shippingAddress.city",
                                        e.target.value
                                    )
                                }
                                className={classes.input}
                                placeholder="Málaga"
                                disabled={loading}
                            />
                        </div>

                        <div className={classes.inputGroup}>
                            <label className={classes.label}>
                                Código Postal *
                            </label>
                            <input
                                type="text"
                                value={formData.shippingAddress.postalCode}
                                onChange={(e) =>
                                    handleInputChange(
                                        "shippingAddress.postalCode",
                                        e.target.value
                                    )
                                }
                                className={`${classes.input} ${
                                    errors["shippingAddress.postalCode"]
                                        ? classes.inputError
                                        : ""
                                }`}
                                placeholder="29001"
                                maxLength={5}
                                disabled={loading}
                            />
                            {errors["shippingAddress.postalCode"] && (
                                <span className={classes.error}>
                                    {errors["shippingAddress.postalCode"]}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className={classes.formRow}>
                        <div className={classes.inputGroup}>
                            <label className={classes.label}>Provincia</label>
                            <input
                                type="text"
                                value={formData.shippingAddress.province}
                                className={classes.input}
                                disabled
                            />
                        </div>

                        <div className={classes.inputGroup}>
                            <label className={classes.label}>País</label>
                            <input
                                type="text"
                                value={formData.shippingAddress.country}
                                className={classes.input}
                                disabled
                            />
                        </div>
                    </div>
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
                        disabled={loading}
                    >
                        {loading ? "Procesando..." : "Continuar al pago →"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ShippingForm;
