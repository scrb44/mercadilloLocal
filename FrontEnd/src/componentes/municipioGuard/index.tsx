// src/components/guards/MunicipioGuard.tsx - FINAL SIN FLASH

import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMunicipio } from "../../contexts/municipioContext";

interface MunicipioGuardProps {
    children: React.ReactNode;
}

function MunicipioGuard({ children }: MunicipioGuardProps) {
    const { hasMunicipio, isReady } = useMunicipio();
    const navigate = useNavigate();
    const location = useLocation();
    const hasRedirected = useRef(false);

    useEffect(() => {
        // Solo redirigir una vez y cuando esté listo
        if (!isReady || hasRedirected.current) return;

        // Si no hay municipio y no estamos en la página de selección
        if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
            hasRedirected.current = true;

            // Redirigir inmediatamente sin timeout
            navigate("/seleccionar-municipio", { replace: true });
        }
    }, [hasMunicipio, isReady, location.pathname, navigate]);

    // SIEMPRE renderizar children para evitar flash
    // La redirección ocurre en background
    return <>{children}</>;
}

export default MunicipioGuard;
