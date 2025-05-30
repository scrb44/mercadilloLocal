import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Footer, Header } from "../../componentes";
import classes from "./register.module.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        usuario: "",
        name: "",
        email: "",
        telf: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
        role: "comprador",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

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

        if (!formData.usuario.trim()) {
            errors.usuario = "El nombre de usuario es obligatorio";
        }

        if (!formData.telf.trim()) {
            errors.telf = "El teléfono es obligatorio";
        } else if (!/^[0-9]{7,15}$/.test(formData.telf)) {
            errors.telf = "Número de teléfono inválido";
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

        if (!validateForm()) return;
        setLoading(true);

        try {
await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    usuario: formData.usuario,
                    nombre: formData.name,
                    email: formData.email,
                    password: formData.password,
                    telf: formData.telf,
                    role: formData.role,
                }),
            });

            console.log("✅ Registro enviado:", {
                usuario: formData.usuario,
                nombre: formData.name,
                email: formData.email,
                telf: formData.telf,
            });

            setSuccess(true);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setFormErrors({
                general: "Error al crear la cuenta. Inténtalo de nuevo.",
            });
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
        if (field === "password") {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    if (success) {
        return (
            <div className={classes.register}>
                <Header />
                <div className={classes.container}>
                    <div className={classes.successCard}>
                        <div className={classes.successIcon}>✅</div>
                        <h1 className={classes.successTitle}>¡Cuenta creada exitosamente!</h1>
                        <p className={classes.successText}>
                            Te hemos enviado un email de confirmación a <strong>{formData.email}</strong>
                        </p>
                        <p className={classes.redirectText}>
                            Serás redirigido al login en unos segundos...
                        </p>
                        <Link to="/login" className={classes.loginLink}>Ir al login ahora</Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={classes.register}>
            <Header />
            <div className={classes.container}>
                <main className={classes.main}>
                    <div className={classes.registerCard}>
                        <form onSubmit={handleSubmit} className={classes.registerForm}>
                            {formErrors.general && (
                                <div className={classes.errorBanner}>
                                    <span className={classes.errorIcon}>⚠️</span>
                                    <span className={classes.errorText}>{formErrors.general}</span>
                                </div>
                            )}

                            {/* Nombre */}
                            <div className={classes.inputGroup}>
                                <label htmlFor="name" className={classes.inputLabel}>Nombre completo *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`${classes.inputField} ${formErrors.name ? classes.inputError : ""}`}
                                    placeholder="Tu nombre completo"
                                    disabled={loading}
                                />
                                {formErrors.name && <span className={classes.fieldError}>{formErrors.name}</span>}
                            </div>

                            {/* Email */}
                            <div className={classes.inputGroup}>
                                <label htmlFor="email" className={classes.inputLabel}>Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`${classes.inputField} ${formErrors.email ? classes.inputError : ""}`}
                                    placeholder="tu@email.com"
                                    disabled={loading}
                                />
                                {formErrors.email && <span className={classes.fieldError}>{formErrors.email}</span>}
                            </div>

                            {/* Usuario */}
                            <div className={classes.inputGroup}>
                                <label htmlFor="usuario" className={classes.inputLabel}>Usuario *</label>
                                <input
                                    type="text"
                                    id="usuario"
                                    name="usuario"
                                    value={formData.usuario}
                                    onChange={handleInputChange}
                                    className={`${classes.inputField} ${formErrors.usuario ? classes.inputError : ""}`}
                                    placeholder="Tu nombre de usuario"
                                    disabled={loading}
                                />
                                {formErrors.usuario && <span className={classes.fieldError}>{formErrors.usuario}</span>}
                            </div>
                            <div className={classes.inputGroup}>
    <label className={classes.inputLabel}>Tipo de cuenta *</label>
    <div className={classes.radioGroup}>
        <label>
            <input
                type="radio"
                name="role"
                value="comprador"
                checked={formData.role === "comprador"}
                onChange={handleInputChange}
            />
            Comprador
        </label>
        <label>
            <input
                type="radio"
                name="role"
                value="vendedor"
                checked={formData.role === "vendedor"}
                onChange={handleInputChange}
            />
            Vendedor
        </label>
    </div>
    {formErrors.role && (
        <span className={classes.fieldError}>{formErrors.role}</span>
    )}
</div>


                            {/* Teléfono */}
                            <div className={classes.inputGroup}>
                                <label htmlFor="telf" className={classes.inputLabel}>Teléfono *</label>
                                <input
                                    type="tel"
                                    id="telf"
                                    name="telf"
                                    value={formData.telf}
                                    onChange={handleInputChange}
                                    className={`${classes.inputField} ${formErrors.telf ? classes.inputError : ""}`}
                                    placeholder="Tu número de teléfono"
                                    disabled={loading}
                                />
                                {formErrors.telf && <span className={classes.fieldError}>{formErrors.telf}</span>}
                            </div>

                            {/* Contraseña */}
                            <div className={classes.inputGroup}>
                                <label htmlFor="password" className={classes.inputLabel}>Contraseña *</label>
                                <div className={classes.passwordContainer}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`${classes.inputField} ${formErrors.password ? classes.inputError : ""}`}
                                        placeholder="Mínimo 6 caracteres"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility("password")}
                                        className={classes.passwordToggle}
                                        disabled={loading}
                                    >
                                        {showPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formErrors.password && <span className={classes.fieldError}>{formErrors.password}</span>}
                            </div>

                            {/* Confirmar contraseña */}
                            <div className={classes.inputGroup}>
                                <label htmlFor="confirmPassword" className={classes.inputLabel}>Confirmar contraseña *</label>
                                <div className={classes.passwordContainer}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`${classes.inputField} ${formErrors.confirmPassword ? classes.inputError : ""}`}
                                        placeholder="Repite tu contraseña"
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                        className={classes.passwordToggle}
                                        disabled={loading}
                                    >
                                        {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                                    </button>
                                </div>
                                {formErrors.confirmPassword && <span className={classes.fieldError}>{formErrors.confirmPassword}</span>}
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
                                        <Link to="/terminos" className={classes.termsLink}>términos y condiciones</Link> y la{" "}
                                        <Link to="/privacidad" className={classes.termsLink}>política de privacidad</Link>
                                    </span>
                                </label>
                                {formErrors.acceptTerms && <span className={classes.fieldError}>{formErrors.acceptTerms}</span>}
                            </div>

                            <button type="submit" disabled={loading} className={classes.submitButton}>
                                {loading ? <><span className={classes.spinner}></span> Creando cuenta...</> : "Crear Cuenta"}
                            </button>
                        </form>

                        <div className={classes.registerFooter}>
                            <p className={classes.footerText}>
                                ¿Ya tienes una cuenta?{" "}
                                <Link to="/login" className={classes.loginLink}>Iniciar sesión</Link>
                            </p>
                            <Link to="/" className={classes.backLink}>← Volver al inicio</Link>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default Register;
