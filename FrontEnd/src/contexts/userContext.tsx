import axios from "axios";

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

    const response = await axios.post("http://localhost:8080/api/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    const { token, rol, nombre, usuario, id } = response.data;

    // Guardar token localmente para usar en otras peticiones
    localStorage.setItem("token", token);

    const userData: UserInterface = {
      id,
      usuario,
      nombre,
      email: credentials.email,
      role: rol,
      token,
    };

    setUser(userData);
  } catch (err: any) {
    if (err.response?.data?.message) {
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
