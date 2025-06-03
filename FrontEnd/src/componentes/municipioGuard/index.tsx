// src/components/guards/MunicipioGuard.tsx - OPTIMIZADO

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMunicipio } from "../../contexts/municipioContext";

interface MunicipioGuardProps {
    children: React.ReactNode;
}

function MunicipioGuard({ children }: MunicipioGuardProps) {
    const { hasMunicipio, loading, isReady } = useMunicipio();
    const navigate = useNavigate();
    const location = useLocation();
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Solo actuar cuando esté completamente listo
        if (!isReady) return;

        // Marcar que ya hemos hecho la primera verificación
        if (!hasChecked) {
            setHasChecked(true);
        }

        // Si no hay municipio seleccionado y no estamos ya en la página de selección
        if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
            // Usar timeout para evitar bloquear el render inicial
            const timer = setTimeout(() => {
                navigate("/seleccionar-municipio", { replace: true });
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [hasMunicipio, isReady, location.pathname, navigate, hasChecked]);

    // Si no está listo o está cargando, no mostrar nada (evita parpadeo)
    if (!isReady || loading) {
        return null;
    }

    // Si no hay municipio y no estamos en selección, mostrar contenido hasta que se redirija
    if (!hasMunicipio && location.pathname !== "/seleccionar-municipio") {
        // Permitir que el contenido se renderice brevemente antes de la redirección
        // Esto evita pantallas en blanco y mejora la UX
        return <>{children}</>;
    }

    // Si todo está bien, renderizar los children
    return <>{children}</>;
}

export default MunicipioGuard;
