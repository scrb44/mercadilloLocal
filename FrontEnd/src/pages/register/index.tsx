// src/pages/register/index.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Footer, Header } from "../../componentes";

import classes from "./register.module.css";

function Register() {
    const navigate = useNavigate();

    // ============ ESTADO LOCAL ============
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // ============ HANDLERS ============
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Limpiar error específico del campo
        if (formErrors[name]) {
            setFormErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const errors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            errors.name = "El nombre es obligatorio";
        } else if (formData.name.trim().length < 2) {
            errors.name = "El nombre debe tener al menos 2 caracteres";
        }

        if (!formData.email) {
            errors.email = "El email es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email no válido";
        }

        if (!formData.password) {
            errors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
            errors.password = "La contraseña debe tener al menos 6 caracteres";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password =
                "La contraseña debe contener al menos una mayúscula, una minúscula y un número";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Confirma tu contraseña";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (!formData.acceptTerms) {
            errors.acceptTerms = "Debes aceptar los términos y condiciones";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            // Simular llamada a API
            await new Promise((resolve) => setTimeout(resolve, 2000));

            console.log("🔧 Registro simulado:", {
                name: formData.name,
                email: formData.email,
                // No logueamos la contraseña por seguridad
            });

            setSuccess(true);

            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setFormErrors({
                general: "Error al crear la cuenta. Inténtalo de nuevo.",
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (
        field: "password" | "confirmPassword"
    ) => {
        if (field === "password") {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    // ============ RENDER SUCCESS ============
    if (success) {
        return (
            <div className={classes.register}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.successCard}>
                        <div className={classes.successIcon}>✅</div>
                        <h1 className={classes.successTitle}>
                            ¡Cuenta creada exitosamente!
                        </h1>
                        <p className={classes.successText}>
                            Te hemos enviado un email de confirmación a{" "}
                            <strong>{formData.email}</strong>
                        </p>
                        <p className={classes.redirectText}>
                            Serás redirigido al login en unos segundos...
                        </p>
                        <Link to="/login" className={classes.loginLink}>
                            Ir al login ahora
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============ RENDER FORM ============
    return (
        <div className={classes.register}>
            <Header />

            <div className={classes.container}>
                <main className={classes.main}>
                    <div className={classes.registerCard}>
                        <div className={classes.registerHeader}>
                            <h1 className={classes.registerTitle}>
                                Crear Cuenta
                            </h1>
                            <p className={classes.registerSubtitle}>
                                Únete a Mercadillo Local y empieza a comprar
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className={classes.registerForm}
                        >
                            {formErrors.general && (
                                <div className={classes.errorBanner}>
                                    <span className={classes.errorIcon}>
                                        ⚠️
                                    </span>
                                    <span className={classes.errorText}>
                                        {formErrors.general}
                                    </span>
                                </div>
                            )}

                            {/* Campo Nombre */}
                            <div className={classes.inputGroup}>
                                <label
                                    htmlFor="name"
                                    className={classes.inputLabel}
                                >
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    onChange={handleInputChange}
                                    className={`${classes.inputField} ${
                                        formErrors.name
                                            ? classes.inputError
                                            : ""
                                    }`}
                                    placeholder="Tu nombre completo"
                                    disabled={loading}
                                />
                                {formErrors.name && (
                                    <span className={classes.fieldError}>
                                        {formErrors.name}
                                    </span>
                                )}
                            </div>

                            {/* Campo Email */}
                            <div className={classes.inputGroup}>
                                <label
                                    htmlFor="email"
                                    className={classes.inputLabel}
                                >
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`${classes.inputField} ${
                                        formErrors.email
                                            ? classes.inputError
                                            : ""
                                    }`}
                                    placeholder="tu@email.com"
                                    disabled={loading}
                                />
                                {formErrors.email && (
                                    <span className={classes.fieldError}>
                                        {formErrors.email}
                                    </span>
                                )}
                            </div>

                            {/* Campo Contraseña */}
                            <div className={classes.inputGroup}>
                                <label
                                    htmlFor="password"
                                    className={classes.inputLabel}
                                >
                                    Contraseña *
                                </label>
                                <div className={classes.passwordContainer}>
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`${classes.inputField} ${
                                            formErrors.password
                                                ? classes.inputError
                                                : ""
                                        }`}
                                        placeholder="Mínimo 6 caracteres"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility("password")
                                        }
                                        className={classes.passwordToggle}
                                        disabled={loading}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formErrors.password && (
                                    <span className={classes.fieldError}>
                                        {formErrors.password}
                                    </span>
                                )}
                            </div>

                            {/* Campo Confirmar Contraseña */}
                            <div className={classes.inputGroup}>
                                <label
                                    htmlFor="confirmPassword"
                                    className={classes.inputLabel}
                                >
                                    Confirmar contraseña *
                                </label>
                                <div className={classes.passwordContainer}>
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`${classes.inputField} ${
                                            formErrors.confirmPassword
                                                ? classes.inputError
                                                : ""
                                        }`}
                                        placeholder="Repite tu contraseña"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            togglePasswordVisibility(
                                                "confirmPassword"
                                            )
                                        }
                                        className={classes.passwordToggle}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formErrors.confirmPassword && (
                                    <span className={classes.fieldError}>
                                        {formErrors.confirmPassword}
                                    </span>
                                )}
                            </div>

                            {/* Términos y condiciones */}
                            <div className={classes.inputGroup}>
                                <label className={classes.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        name="acceptTerms"
                                        checked={formData.acceptTerms}
                                        onChange={handleInputChange}
                                        className={classes.checkbox}
                                        disabled={loading}
                                    />
                                    <span className={classes.checkboxLabel}>
                                        Acepto los{" "}
                                        <Link
                                            to="/terminos"
                                            className={classes.termsLink}
                                        >
                                            términos y condiciones
                                        </Link>{" "}
                                        y la{" "}
                                        <Link
                                            to="/privacidad"
                                            className={classes.termsLink}
                                        >
                                            política de privacidad
                                        </Link>
                                    </span>
                                </label>
                                {formErrors.acceptTerms && (
                                    <span className={classes.fieldError}>
                                        {formErrors.acceptTerms}
                                    </span>
                                )}
                            </div>

                            {/* Botón de submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={classes.submitButton}
                            >
                                {loading ? (
                                    <>
                                        <span
                                            className={classes.spinner}
                                        ></span>
                                        Creando cuenta...
                                    </>
                                ) : (
                                    "Crear Cuenta"
                                )}
                            </button>
                        </form>

                        {/* Enlaces adicionales */}
                        <div className={classes.registerFooter}>
                            <p className={classes.footerText}>
                                ¿Ya tienes una cuenta?{" "}
                                <Link to="/login" className={classes.loginLink}>
                                    Iniciar sesión
                                </Link>
                            </p>
                            <Link to="/" className={classes.backLink}>
                                ← Volver al inicio
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

export default Register;
