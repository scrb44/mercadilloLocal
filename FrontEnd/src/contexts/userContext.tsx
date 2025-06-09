// src/contexts/userContext.tsx - CORREGIDO

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

export interface UserContextType {
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
        const initializeAuth = () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setLoading(false);
                    return;
                }

                // Verificar si el token es válido
                try {
                    const payload = JSON.parse(atob(token.split(".")[1]));
                    const isExpired = payload.exp * 1000 < Date.now();

                    if (isExpired) {
                        localStorage.removeItem("token");
                        delete axios.defaults.headers.common["Authorization"];
                        setLoading(false);
                        return;
                    }

                    // Token válido - construir usuario desde payload
                    const userData: UserInterface = {
                        id: payload.id || payload.userId || payload.sub,
                        role: payload.role || payload.rol || "COMPRADOR",
                        usuario:
                            payload.usuario || payload.username || payload.sub,
                        nombre: payload.nombre || payload.name || "",
                        email: payload.email || payload.sub || "",
                        token: token,
                        verificado: payload.verificado || false,
                        imagen: payload.imagen || "",
                        localidad: payload.localidad || undefined,
                    };

                    setUser(userData);
                    axios.defaults.headers.common[
                        "Authorization"
                    ] = `Bearer ${token}`;
                } catch (tokenError) {
                    console.warn("⚠️ Token inválido:", tokenError);
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                }
            } catch (error) {
                console.error("❌ Error inicializando autenticación:", error);
            } finally {
                setLoading(false);
            }
        };

        initializeAuth();
    }, []);

    // ============ LOGIN ============
    const login = async (credentials: LoginCredentials): Promise<void> => {
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

            const { token, ...userData } = response.data;

            if (!token) {
                throw new Error("No se recibió token del servidor");
            }

            // Guardar token
            localStorage.setItem("token", token);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Crear objeto de usuario
            const userObject: UserInterface = {
                id: userData.id,
                role: userData.rol || userData.role || "COMPRADOR",
                usuario: userData.usuario || userData.username,
                nombre: userData.nombre || userData.name,
                email: userData.email,
                token: token,
                verificado: userData.verificado || false,
                imagen: userData.imagen || "",
                localidad: userData.localidad || undefined,
            };

            setUser(userObject);
        } catch (err: any) {
            console.error("❌ Error en login:", err);

            let errorMessage = "Credenciales incorrectas";

            if (err.response?.data?.mensaje) {
                errorMessage = err.response.data.mensaje;
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ============ LOGOUT ============
    const logout = () => {
        // Limpiar estado local
        setUser(null);
        setError(null);

        // Limpiar token de localStorage
        localStorage.removeItem("token");

        // Limpiar headers de axios
        delete axios.defaults.headers.common["Authorization"];

        // Limpiar cache de servicios
        try {
            mercadilloService.clearLocalCache();
        } catch (error) {
            console.warn("Error limpiando cache:", error);
        }
    };

    // ============ VALOR DEL CONTEXTO ============
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
