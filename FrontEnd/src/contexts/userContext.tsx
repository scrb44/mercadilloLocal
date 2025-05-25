// src/context/UserContext.ts
import React, {
    createContext,
    useContext,
    useReducer,
    useEffect,
    type ReactNode,
} from "react";
import mercadilloService from "../services/mercadilloService";

import {
    type UserInterface,
    type LoginCredentials,
    type RegisterData,
    type UserStateInterface,
    type UserAction,
} from "../types/types";

// Context type
interface UserContextType {
    state: UserStateInterface;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateProfile: (data: Partial<UserInterface>) => Promise<void>;
    checkAuthStatus: () => Promise<void>;
}

// Estado inicial
const initialState: UserStateInterface = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Reducer
const userReducer = (
    state: UserStateInterface,
    action: UserAction
): UserStateInterface => {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_ERROR":
            return { ...state, error: action.payload, loading: false };

        case "LOGIN_SUCCESS":
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null,
            };

        case "LOGOUT":
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };

        case "UPDATE_PROFILE":
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null,
            };

        default:
            return state;
    }
};

// Crear el Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider Component
interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });

            const response = await fetch("auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }

            const { user, token } = await response.json();
            localStorage.setItem("auth_token", token);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload:
                    error instanceof Error ? error.message : "Error de login",
            });
            throw error;
        }
    };

    const register = async (data: RegisterData) => {
        try {
            dispatch({ type: "SET_LOADING", payload: true });

            const response = await fetch("auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Error en el registro");
            }

            const { user, token } = await response.json();
            localStorage.setItem("auth_token", token);
            dispatch({ type: "LOGIN_SUCCESS", payload: user });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload:
                    error instanceof Error
                        ? error.message
                        : "Error de registro",
            });
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        mercadilloService.clearLocalCache();
        dispatch({ type: "LOGOUT" });
    };

    const updateProfile = async (data: Partial<UserInterface>) => {
        try {
            const response = await fetch("user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "auth_token"
                    )}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Error actualizando perfil");
            }

            const updatedUser = await response.json();
            dispatch({ type: "UPDATE_PROFILE", payload: updatedUser });
        } catch (error) {
            dispatch({
                type: "SET_ERROR",
                payload:
                    error instanceof Error
                        ? error.message
                        : "Error actualizando perfil",
            });
            throw error;
        }
    };

    const checkAuthStatus = async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) return;

        try {
            dispatch({ type: "SET_LOADING", payload: true });

            const response = await fetch("auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
                const user = await response.json();
                dispatch({ type: "LOGIN_SUCCESS", payload: user });
            } else {
                localStorage.removeItem("auth_token");
                dispatch({ type: "LOGOUT" });
            }
        } catch (error) {
            console.error("Error checking auth status:", error);
            localStorage.removeItem("auth_token");
            dispatch({ type: "LOGOUT" });
        }
    };

    const contextValue: UserContextType = {
        state,
        login,
        register,
        logout,
        updateProfile,
        checkAuthStatus,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserContext;
