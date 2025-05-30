import axiosInstance from "../services/axiosConfig"; // ajusta ruta si es necesario

import React, {
    createContext,
    useContext,
    useState,
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
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// ============ PROVIDER ============

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

const response = await axiosInstance.post("/auth/login", {

      email: credentials.email,
      password: credentials.password,
    });

    const { rol, nombre, token } = response.data;

    // Guarda el token solo si existe (NO para admin)
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    const userData: UserInterface = {
      id: 1, // reemplaza con id real si backend lo envía
      name: nombre,
      email: credentials.email,
      role: rol,
      isEmailVerified: true,
      token: token || null, // si quieres guardar token en user
    };

    setUser(userData);
    console.log("✅ Login exitoso:", userData);
  } catch (err: any) {
    console.error("❌ Error en login:", err);
    setError(err.response?.data || "Error de login");
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
