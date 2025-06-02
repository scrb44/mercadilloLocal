// src/components/guards/MunicipioGuard.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./municipioGuard.module.css";

interface MunicipioGuardProps {
    children: React.ReactNode;
}

function MunicipioGuard({ children }: MunicipioGuardProps) {
    const { hasMunicipio, loading } = useMunicipio();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // No hacer nada mientras se está cargando
        if (loading) return;

        // Si no hay municipio seleccionado y no estamos ya en la página de selección
        if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
            navigate("/seleccionar-municipio", { replace: true });
        }
    }, [hasMunicipio, loading, location.pathname, navigate]);

    // Mostrar loading mientras se verifica el municipio
    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <div className={classes.loadingCard}>
                    <div className={classes.loadingSpinner}></div>
                    <p className={classes.loadingText}>
                        Cargando Mercadillo Local...
                    </p>
                </div>
            </div>
        );
    }

    // Si no hay municipio, no renderizar nada (la redirección ya se está manejando)
    if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
        return null;
    }

    // Si todo está bien, renderizar los children
    return <>{children}</>;
}

export default MunicipioGuard;
