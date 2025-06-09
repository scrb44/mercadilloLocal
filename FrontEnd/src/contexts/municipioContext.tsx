// src/contexts/municipioContext.tsx - ACTUALIZADO para cargar desde API

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import { getAllLocalidades } from "../services/localidadesService";

// ============ INTERFACES ============
export interface MunicipioInterface {
    id: number;
    nombre: string;
    provincia: string;
}

interface MunicipioContextType {
    municipio: MunicipioInterface | null;
    municipios: MunicipioInterface[];
    loading: boolean;
    error: string | null;
    setMunicipio: (municipio: MunicipioInterface) => void;
    clearMunicipio: () => void;
    hasMunicipio: boolean;
    isReady: boolean;
    refetchMunicipios: () => Promise<void>;
}

// ============ CONTEXTO ============
const MunicipioContext = createContext<MunicipioContextType | undefined>(
    undefined
);

// ============ CONSTANTES ============
const STORAGE_KEY = "mercadillo-municipio";

// ============ PROVIDER ============
interface MunicipioProviderProps {
    children: ReactNode;
}

export function MunicipioProvider({ children }: MunicipioProviderProps) {
    // Estados principales
    const [municipio, setMunicipioState] = useState<MunicipioInterface | null>(
        null
    );
    const [municipios, setMunicipios] = useState<MunicipioInterface[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ============ FUNCIONES DE MUNICIPIOS ============

    /**
     * Carga las localidades desde la API
     */
    const loadMunicipios = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Cargar desde la API
            const localidades = await getAllLocalidades();
            setMunicipios(localidades);
        } catch (err: any) {
            setError(err.message || "Error al cargar las localidades");

            // En caso de error, usar datos por defecto (opcional)
            // setMunicipios(MUNICIPIOS_MALAGA_FALLBACK);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Función pública para recargar municipios
     */
    const refetchMunicipios = useCallback(async () => {
        await loadMunicipios();
    }, [loadMunicipios]);

    // ============ FUNCIONES DE MUNICIPIO SELECCIONADO ============

    /**
     * Establece el municipio seleccionado y lo guarda en localStorage
     */
    const setMunicipio = useCallback((municipio: MunicipioInterface) => {
        setMunicipioState(municipio);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(municipio));
        } catch (error) {
            console.warn(
                "⚠️ Error guardando municipio en localStorage:",
                error
            );
        }
    }, []);

    /**
     * Limpia el municipio seleccionado
     */
    const clearMunicipio = useCallback(() => {
        setMunicipioState(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn(
                "⚠️ Error limpiando municipio de localStorage:",
                error
            );
        }
    }, []);

    // ============ EFECTOS ============

    /**
     * Efecto inicial: cargar municipios de la API y municipio guardado del localStorage
     */
    useEffect(() => {
        // Cargar municipio guardado del localStorage
        try {
            const savedMunicipio = localStorage.getItem(STORAGE_KEY);
            if (savedMunicipio) {
                const parsedMunicipio = JSON.parse(savedMunicipio);
                setMunicipioState(parsedMunicipio);
            }
        } catch (error) {
            console.warn(
                "⚠️ Error cargando municipio desde localStorage:",
                error
            );
        }

        // Cargar municipios desde la API
        loadMunicipios();
    }, [loadMunicipios]);

    // ============ VALORES COMPUTADOS ============
    const hasMunicipio = useMemo(() => municipio !== null, [municipio]);
    const isReady = useMemo(() => !loading && !error, [loading, error]);

    // ============ VALOR DEL CONTEXTO ============
    const contextValue = useMemo(
        () => ({
            municipio,
            municipios,
            loading,
            error,
            setMunicipio,
            clearMunicipio,
            hasMunicipio,
            isReady,
            refetchMunicipios,
        }),
        [
            municipio,
            municipios,
            loading,
            error,
            setMunicipio,
            clearMunicipio,
            hasMunicipio,
            isReady,
            refetchMunicipios,
        ]
    );

    return (
        <MunicipioContext.Provider value={contextValue}>
            {children}
        </MunicipioContext.Provider>
    );
}

// ============ HOOK ============
export function useMunicipio() {
    const context = useContext(MunicipioContext);
    if (context === undefined) {
        throw new Error("useMunicipio must be used within a MunicipioProvider");
    }
    return context;
}

export default MunicipioContext;
