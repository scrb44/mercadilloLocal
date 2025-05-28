// src/pages/login/index.tsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts";

import Footer from "../../componentes/footer";
import Header from "../../componentes/header";

import classes from "./login.module.css";

function Login() {
    const { login, loading, error } = useUser();
    const navigate = useNavigate();

    // ============ ESTADO LOCAL ============
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    // ============ HANDLERS ============
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
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

        if (!formData.email) {
            errors.email = "El email es obligatorio";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = "Email no válido";
        }

        if (!formData.password) {
            errors.password = "La contraseña es obligatoria";
        } else if (formData.password.length < 6) {
            errors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await login({
                email: formData.email,
                password: formData.password,
            });

            // Redirigir al home después del login exitoso
            navigate("/");
        } catch (err) {
            // El error ya se maneja en el contexto
            console.error("Login failed:", err);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // ============ RENDER ============
    return (
        <div className={classes.login}>
            <Header />

            <div className={classes.container}>
                <main className={classes.main}>
                    <div className={classes.loginCard}>
                        <div className={classes.loginHeader}>
                            <h1 className={classes.loginTitle}>
                                Iniciar Sesión
                            </h1>
                            <p className={classes.loginSubtitle}>
                                Bienvenido de vuelta a Mercadillo Local
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className={classes.loginForm}
                        >
                            {error && (
                                <div className={classes.errorBanner}>
                                    <span className={classes.errorIcon}>
                                        ⚠️
                                    </span>
                                    <span className={classes.errorText}>
                                        {error}
                                    </span>
                                </div>
                            )}

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
                                        placeholder="Tu contraseña"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
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

                            {/* Opciones adicionales */}
                            <div className={classes.formOptions}>
                                <label className={classes.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        className={classes.checkbox}
                                    />
                                    <span className={classes.checkboxLabel}>
                                        Recordarme
                                    </span>
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className={classes.forgotLink}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
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
                                        Iniciando sesión...
                                    </>
                                ) : (
                                    "Iniciar Sesión"
                                )}
                            </button>
                        </form>

                        {/* Enlaces adicionales */}
                        <div className={classes.loginFooter}>
                            <p className={classes.footerText}>
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/registro"
                                    className={classes.registerLink}
                                >
                                    Crear cuenta
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

export default Login;
