import axios from "axios";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react";
import mercadilloService from "../services";
import { type UserInterface, type LoginCredentials } from "../types/types";

// ============ INTERFACES ============

interface UserContextType {
    user: UserInterface | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    setUser: (user: UserInterface | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============ PROVIDER ============

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = user !== null;

    // ============ VERIFICAR TOKEN AL INICIAR ============
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                try {
                    // Configurar axios con el token
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;

                    // Hacer petición al endpoint de perfil para obtener datos completos
                    const response = await axios.get(
                        "http://localhost:8080/api/auth/perfil"
                    );

                    // Mapear la respuesta del backend
                    const userData: UserInterface = {
                        id: response.data.id,
                        role: response.data.rol,
                        usuario: response.data.usuario,
                        nombre: response.data.nombre,
                        email: response.data.email,
                        token: token,
                        verificado: response.data.verificado || false,
                        imagen: response.data.imagen || "",
                        localidad: response.data.localidad || undefined,
                    };

                    setUser(userData);
                } catch (error: any) {
                    console.warn("⚠️ Token inválido o expirado, eliminando...");
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                }
            } catch (error: any) {
                console.warn("⚠️ Error inicializando autenticación:", error);
                localStorage.removeItem("token");
                delete axios.defaults.headers.common["Authorization"];
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    email: credentials.email,
                    password: credentials.password,
                }
            );

            // ✅ MAPEAR CORRECTAMENTE la respuesta del backend
            const backendData = response.data;

            // Guardar token localmente
            localStorage.setItem("token", backendData.token);

            // Configurar axios para futuras requests
            axios.defaults.headers.common[
                "Authorization"
            ] = `Bearer ${backendData.token}`;

            // ✅ MAPEAR con los nombres correctos del backend
            const userData: UserInterface = {
                id: backendData.id,
                role: backendData.rol, // ⚠️ IMPORTANTE: El backend usa "rol", no "role"
                usuario: backendData.usuario,
                nombre: backendData.nombre,
                email: backendData.email,
                token: backendData.token,
                verificado: true, // Si hizo login exitoso, está verificado
                imagen: backendData.imagen || "",
                localidad: undefined, // Este campo no viene en la respuesta del login
            };

            setUser(userData);
        } catch (err: any) {
            console.error("❌ Error en login:", err);

            if (err.response?.data?.mensaje) {
                setError(err.response.data.mensaje);
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Credenciales incorrectas");
            }
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Limpiar estado local
        setUser(null);
        setError(null);

        // Limpiar token de localStorage
        localStorage.removeItem("token");

        // Limpiar headers de axios
        delete axios.defaults.headers.common["Authorization"];

        // Limpiar cache de servicios
        mercadilloService.clearLocalCache();
    };

    const contextValue: UserContextType = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        setUser,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

// ============ HOOK ============

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserContext;
