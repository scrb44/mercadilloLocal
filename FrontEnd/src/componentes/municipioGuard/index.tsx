// src/components/guards/MunicipioGuard.tsx - MODIFICADO PARA RENDERIZAR SIEMPRE

import { useMunicipio } from "../../contexts/municipioContext";
import classes from "./municipioGuard.module.css";

interface MunicipioGuardProps {
    children: React.ReactNode;
}

function MunicipioGuard({ children }: MunicipioGuardProps) {
    return <>{children}</>;
}

export default MunicipioGuard;
