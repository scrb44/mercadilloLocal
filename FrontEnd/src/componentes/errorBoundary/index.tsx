// src/components/errors/ErrorBoundary.tsx
import React, { Component, type ReactNode, type ErrorInfo } from "react";
import { useNavigate } from "react-router-dom";
import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./errorBoundary.module.css";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

class ErrorBoundaryClass extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error capturado por ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}

// Componente funcional para el fallback con acceso a hooks
function ErrorFallback({ error }: { error?: Error }) {
    const navigate = useNavigate();

    // Usar useMunicipio de forma segura
    let municipio = null;
    try {
        const municipioContext = useMunicipio();
        municipio = municipioContext.municipio;
    } catch (e) {
        // Si el contexto no está disponible, municipio será null
        console.warn("MunicipioContext no disponible en ErrorFallback");
    }

    const handleGoHome = () => {
        // Usar navigate en lugar de window.location para evitar recarga
        navigate("/", { replace: true });
    };

    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div className={classes.errorContainer}>
            <div className={classes.errorCard}>
                <div className={classes.errorIcon}>😵</div>
                <h1 className={classes.errorTitle}>¡Oops! Algo salió mal</h1>
                <p className={classes.errorDescription}>
                    Ha ocurrido un error inesperado. No te preocupes, nuestro
                    equipo ya está trabajando para solucionarlo.
                </p>

                {municipio && (
                    <p className={classes.municipioInfo}>
                        📍 Municipio seleccionado:{" "}
                        <strong>{municipio.nombre}</strong>
                    </p>
                )}

                {error && (
                    <details className={classes.errorDetails}>
                        <summary>Detalles técnicos</summary>
                        <pre>{error.message}</pre>
                    </details>
                )}

                <div className={classes.errorActions}>
                    <button
                        onClick={handleGoHome}
                        className={`${classes.errorButton} ${classes.primaryButton}`}
                    >
                        🏠 Ir al inicio
                    </button>
                    <button
                        onClick={handleReload}
                        className={`${classes.errorButton} ${classes.secondaryButton}`}
                    >
                        🔄 Recargar página
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente para páginas 404
export function NotFoundPage() {
    const navigate = useNavigate();

    // Usar useMunicipio de forma segura
    let municipio = null;
    try {
        const municipioContext = useMunicipio();
        municipio = municipioContext.municipio;
    } catch (e) {
        // Si el contexto no está disponible, municipio será null
        console.warn("MunicipioContext no disponible en NotFoundPage");
    }

    const handleGoHome = () => {
        // Usar navigate en lugar de window.location para evitar recarga
        navigate("/", { replace: true });
    };

    return (
        <div className={classes.notFoundContainer}>
            <div className={classes.notFoundCard}>
                <div className={classes.notFoundIcon}>🗺️</div>
                <h1 className={classes.notFoundCode}>404</h1>
                <h2 className={classes.notFoundTitle}>Página no encontrada</h2>
                <p className={classes.notFoundDescription}>
                    Lo sentimos, pero la página que buscas no existe o ha sido
                    movida.
                </p>

                {municipio && (
                    <div className={classes.municipioBadge}>
                        <p>
                            📍 Te llevamos de vuelta a{" "}
                            <strong>{municipio.nombre}</strong>
                        </p>
                    </div>
                )}

                <button onClick={handleGoHome} className={classes.homeButton}>
                    🏠 Volver al inicio
                </button>
            </div>
        </div>
    );
}

// HOC para envolver componentes con ErrorBoundary
export function withErrorBoundary<P extends object>(
    Component: React.ComponentType<P>
) {
    return function WrappedComponent(props: P) {
        return (
            <ErrorBoundaryClass>
                <Component {...props} />
            </ErrorBoundaryClass>
        );
    };
}

export default ErrorBoundaryClass;
