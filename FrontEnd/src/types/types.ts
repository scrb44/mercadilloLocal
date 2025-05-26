// ============ INTERFACES DE DOMINIO ============
export interface VendedorInterface {
    id: number;
    img: string;
    name: string;
}

export interface CategoryInterface {
    id: number;
    name: string;
    img: string;
    fatherId?: number;
}

export interface ProductInterface {
    id: number;
    name: string;
    description: string;
    img: string[];
    video?: string[];
    price: number;
    categories: CategoryInterface[];
    vendedor: VendedorInterface;
}

// ============ INTERFACES DE CARRITO ============
export interface CartItemInterface {
    product: ProductInterface;
    quantity: number;
}

export interface CartInterface {
    id?: number;
    userId?: string | number;
    products: CartItemInterface[];
    updatedAt?: string;
}

// Estado del carrito en el Context
export interface CartStateInterface {
    items: CartItemInterface[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    error: string | null;
    syncing: boolean;
}

// ============ INTERFACES DE USUARIO ============
export interface UserInterface {
    id: string | number;
    name: string;
    email: string;
    avatar?: string;
    role: "user" | "vendor" | "admin";
    isEmailVerified: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface UserStateInterface {
    user: UserInterface | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// ============ INTERFACES DE BÚSQUEDA/FILTROS ============
export interface SearchFiltersInterface {
    category?: number;
    vendor?: number;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
}

// ============ INTERFACES DE API ============
export interface ApiError {
    message: string;
    status: number;
}

// ============ UNION TYPES PARA CONTEXTS ============
export type UserAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "LOGIN_SUCCESS"; payload: UserInterface }
    | { type: "LOGOUT" }
    | { type: "UPDATE_PROFILE"; payload: Partial<UserInterface> };

export type CartAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_SYNCING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "LOAD_CART_SUCCESS"; payload: CartItemInterface[] }
    | {
          type: "ADD_ITEM_OPTIMISTIC";
          payload: { product: ProductInterface; quantity: number };
      }
    | { type: "REMOVE_ITEM_OPTIMISTIC"; payload: { productId: number } }
    | {
          type: "UPDATE_QUANTITY_OPTIMISTIC";
          payload: { productId: number; quantity: number };
      }
    | { type: "SYNC_SUCCESS"; payload: CartItemInterface[] }
    | { type: "CLEAR_CART" };
