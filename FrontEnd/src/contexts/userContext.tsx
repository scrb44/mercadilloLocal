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
    setUser: (user: UserInterface | null) => void; // Añadido para actualizar desde otros componentes
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============ PROVIDER ============

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState(true); // Iniciar en true para verificar token
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = user !== null;

    // ============ VERIFICAR TOKEN AL INICIAR ============
    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }
                // Decodificar el payload del JWT
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));

                    // Verificar si el token no ha expirado
                    const now = Date.now() / 1000;
                    if (payload.exp && payload.exp < now) {
                        console.warn("⚠️ Token expirado, limpiando sesión");
                        localStorage.removeItem("token");
                        setLoading(false);
                        return;
                    }

                    // Configurar axios con el token
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;

                    // Crear objeto usuario desde el token - adaptado a tu estructura
                    const userData: UserInterface = {
                        id: payload.id || payload.userId || payload.sub,
                        usuario:
                            payload.usuario || payload.username || payload.sub,
                        nombre: payload.nombre || payload.name || "Usuario",
                        email: payload.email || payload.sub || "",
                        role: payload.role || payload.roles || "COMPRADOR",
                        token,
                    };

                    setUser(userData);
                } catch (decodeError) {
                    console.warn(
                        "⚠️ Error decodificando token, limpiando sesión:",
                        decodeError
                    );
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

            // Tu API devuelve: { id, role, usuario, nombre, email, imagen, token }
            const { token, role, nombre, usuario, id, email, imagen } =
                response.data;

            // Guardar token localmente para usar en otras peticiones
            localStorage.setItem("token", token);

            // Configurar axios para futuras requests
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const userData: UserInterface = {
                id,
                usuario,
                nombre,
                email: email || credentials.email, // Usar email de respuesta o el que se usó para login
                role,
                token,
                imagen, // Incluir imagen de la respuesta
            };

            setUser(userData);
        } catch (err: any) {
            console.error("❌ Error en login:", err);

            if (err.response?.data?.mensaje) {
                // Tu API usa "mensaje" en lugar de "message"
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
        setUser, // Permitir actualizar el usuario desde otros componentes
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
