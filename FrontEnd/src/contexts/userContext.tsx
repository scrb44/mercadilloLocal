// src/context/UserContext.tsx - VERSIÓN SIMPLIFICADA
import React, {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";
import mercadilloService from "../services";
import { type UserInterface, type LoginCredentials } from "../types/types";

// ============ INTERFACES SIMPLES ============
interface UserContextType {
    user: UserInterface | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

// ============ CONTEXT ============
const UserContext = createContext<UserContextType | undefined>(undefined);

// ============ PROVIDER SIMPLIFICADO ============
interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserInterface | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = user !== null;

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Implementar llamada real a API
            // Por ahora, simular login exitoso
            const mockUser: UserInterface = {
                id: 1,
                name: "Usuario Demo",
                email: credentials.email,
                role: "user",
                isEmailVerified: true,
            };

            setUser(mockUser);
            console.log("🔧 Login simulado exitoso:", mockUser);
        } catch (err: any) {
            setError(err.message || "Error de login");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setError(null);
        mercadilloService.clearLocalCache();
        console.log("🔧 Logout exitoso");
    };

    const contextValue: UserContextType = {
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
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
