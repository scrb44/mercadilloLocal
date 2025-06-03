// src/contexts/municipioContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";

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
}

// ============ DATOS DE MUNICIPIOS DE MÁLAGA ============
const MUNICIPIOS_MALAGA: MunicipioInterface[] = [
    { id: 1, nombre: "Málaga", provincia: "Málaga" },
    { id: 2, nombre: "Marbella", provincia: "Málaga" },
    { id: 3, nombre: "Fuengirola", provincia: "Málaga" },
    { id: 4, nombre: "Torremolinos", provincia: "Málaga" },
    { id: 5, nombre: "Benalmádena", provincia: "Málaga" },
    { id: 6, nombre: "Estepona", provincia: "Málaga" },
    { id: 7, nombre: "Mijas", provincia: "Málaga" },
    { id: 8, nombre: "Vélez-Málaga", provincia: "Málaga" },
    { id: 9, nombre: "Antequera", provincia: "Málaga" },
    { id: 10, nombre: "Ronda", provincia: "Málaga" },
    { id: 11, nombre: "Nerja", provincia: "Málaga" },
    { id: 12, nombre: "Rincón de la Victoria", provincia: "Málaga" },
    { id: 13, nombre: "Coín", provincia: "Málaga" },
    { id: 14, nombre: "Alhaurín de la Torre", provincia: "Málaga" },
    { id: 15, nombre: "Alhaurín el Grande", provincia: "Málaga" },
    { id: 16, nombre: "Cártama", provincia: "Málaga" },
    { id: 17, nombre: "Manilva", provincia: "Málaga" },
    { id: 18, nombre: "Casares", provincia: "Málaga" },
    { id: 19, nombre: "Ojén", provincia: "Málaga" },
    { id: 20, nombre: "Istán", provincia: "Málaga" },
];

// ============ CACHE ============
const CACHE_KEY = "mercadillo-municipio-selected";

function getMunicipioFromCache(): MunicipioInterface | null {
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const parsed = JSON.parse(cached);
            // Verificar que el municipio cached sea válido
            if (parsed && parsed.id && parsed.nombre && parsed.provincia) {
                return parsed;
            }
        }
    } catch (error) {
        console.warn("Error leyendo municipio del cache:", error);
        // Limpiar cache corrupto
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (e) {
            // Ignore
        }
    }
    return null;
}

function saveMunicipioToCache(municipio: MunicipioInterface): void {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(municipio));
    } catch (error) {
        console.warn("Error guardando municipio en cache:", error);
    }
}

function clearMunicipioFromCache(): void {
    try {
        localStorage.removeItem(CACHE_KEY);
    } catch (error) {
        console.warn("Error limpiando municipio del cache:", error);
    }
}

// ============ CONTEXT ============
const MunicipioContext = createContext<MunicipioContextType | undefined>(
    undefined
);

// ============ PROVIDER ============
interface MunicipioProviderProps {
    children: ReactNode;
}

export const MunicipioProvider: React.FC<MunicipioProviderProps> = ({
    children,
}) => {
    const [municipio, setMunicipioState] = useState<MunicipioInterface | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [isReady, setIsReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cargar municipio del cache INMEDIATAMENTE (síncrono)
    useEffect(() => {
        const cachedMunicipio = getMunicipioFromCache();
        if (cachedMunicipio) {
            // Verificar que el municipio cached todavía existe en nuestra lista
            const exists = MUNICIPIOS_MALAGA.find(
                (m) => m.id === cachedMunicipio.id
            );
            if (exists) {
                setMunicipioState(cachedMunicipio);
            } else {
                // Si el municipio ya no existe, limpiar cache
                clearMunicipioFromCache();
            }
        }

        // Marcar como listo INMEDIATAMENTE
        setLoading(false);
        setIsReady(true);
    }, []); // Solo ejecutar una vez al montar

    // ============ FUNCIONES ============
    const setMunicipio = (newMunicipio: MunicipioInterface) => {
        setMunicipioState(newMunicipio);
        saveMunicipioToCache(newMunicipio);
        setError(null);
    };

    const clearMunicipio = () => {
        setMunicipioState(null);
        clearMunicipioFromCache();
        setError(null);
    };

    const hasMunicipio = municipio !== null;

    // ============ VALOR DEL CONTEXT ============
    const contextValue: MunicipioContextType = {
        municipio,
        municipios: MUNICIPIOS_MALAGA,
        loading,
        error,
        setMunicipio,
        clearMunicipio,
        hasMunicipio,
        isReady, // NUEVO
    };

    return (
        <MunicipioContext.Provider value={contextValue}>
            {children}
        </MunicipioContext.Provider>
    );
};

// ============ HOOK ============
export const useMunicipio = (): MunicipioContextType => {
    const context = useContext(MunicipioContext);
    if (context === undefined) {
        throw new Error("useMunicipio must be used within a MunicipioProvider");
    }
    return context;
};

export default MunicipioContext;
