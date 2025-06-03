// src/components/guards/MunicipioGuard.tsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./municipioGuard.module.css";

interface MunicipioGuardProps {
    children: React.ReactNode;
}

function MunicipioGuard({ children }: MunicipioGuardProps) {
    const { hasMunicipio, loading, isReady } = useMunicipio();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Solo actuar cuando esté completamente listo
        if (!isReady) return;

        // Si no hay municipio seleccionado y no estamos ya en la página de selección
        if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
            navigate("/seleccionar-municipio", { replace: true });
        }
    }, [hasMunicipio, isReady, location.pathname, navigate]);

    // Si no está listo o está cargando, no mostrar nada (evita parpadeo)
    if (!isReady || loading) {
        return null; // No mostrar loading, solo null para evitar parpadeo
    }

    // Si no hay municipio y no estamos en selección, no renderizar nada
    if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
        return null;
    }

    // Si todo está bien, renderizar los children
    return <>{children}</>;
}

export default MunicipioGuard;
