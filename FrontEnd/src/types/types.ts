// src/types/types.ts - ACTUALIZADO con SearchFiltersWithLocalidad

// ============ INTERFACES DE DOMINIO ============
export interface VendedorInterface {
    id: number;
    img: string;
    name: string;
    imagen: string;
    nombre: string;
    email?: string;
    usuario?: string;
    verificado?: boolean;
    localidad?: string;
    telf?: string;
}

export interface CategoryInterface {
    id: number;
    name: string;
    img: string;
    fatherId?: number;
}

export interface Localidad {
    id: number;
    nombre: string;
    provincia: string | null;
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
    municipality: Localidad;
}

// ============ NUEVOS: INTERFACES PARA CRUD DE PRODUCTOS ============

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    imagen: string;
    categoryIds: number[];
}

export interface ProductCreateRequest {
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: string;
    categoriaIds: number[];
}

export interface ProductUpdateRequest extends ProductCreateRequest {
    id: number;
}

// Estados para el manejo de productos del vendedor
export interface VendorProductsState {
    products: ProductInterface[];
    loading: boolean;
    error: string | null;
    creating: boolean;
    updating: boolean;
    deleting: boolean;
}

// Contexto para gestión de productos del vendedor
export interface VendorProductsContextType {
    state: VendorProductsState;

    // CRUD Operations
    loadProducts: () => Promise<void>;
    createProduct: (productData: ProductFormData) => Promise<void>;
    updateProduct: (id: number, productData: ProductFormData) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;

    // Utilities
    reset: () => void;
    setError: (error: string | null) => void;
}

// ============ INTERFACES DE USUARIO ACTUALIZADAS ============
export interface UserInterface {
    id: number;
    role: "COMPRADOR" | "ADMIN" | "VENDEDOR";
    usuario: string;
    nombre: string;
    email: string;
    password?: string;
    telf?: string;
    verificado?: boolean;
    imagen?: string;
    token?: string;
    localidad?: {
        id: number;
        nombre: string;
        provincia: string;
    };
}

// ============ REST OF EXISTING INTERFACES ============
// (Mantenemos todas las interfaces existentes sin cambios)

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

export interface CartStateInterface {
    items: CartItemInterface[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    error: string | null;
    syncing: boolean;
}

export interface CartContextType {
    items: CartItemInterface[];
    totalItems: number;
    totalPrice: number;
    loading: boolean;
    error: string | null;
    addItem: (product: ProductInterface, quantity?: number) => Promise<void>;
    removeItem: (productId: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getItemQuantity: (productId: number) => number;
    isInCart: (productId: number) => boolean;
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

export interface UserContextType {
    user: UserInterface | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

// ✅ ACTUALIZADO: Interfaces de filtros de búsqueda
export interface SearchFiltersInterface {
    category?: number;
    vendor?: number;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
}

// ✅ NUEVO: Interface extendida con localidad
export interface SearchFiltersWithLocalidad extends SearchFiltersInterface {
    localidad?: number;
}

// ============ INTERFACES DE API ACTUALIZADAS ============
export interface ApiError {
    message: string;
    status: number;
}

// Union types para contexts
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

// Nuevas acciones para productos del vendedor
export type VendorProductAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_CREATING"; payload: boolean }
    | { type: "SET_UPDATING"; payload: boolean }
    | { type: "SET_DELETING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "LOAD_PRODUCTS_SUCCESS"; payload: ProductInterface[] }
    | { type: "CREATE_PRODUCT_SUCCESS"; payload: ProductInterface }
    | { type: "UPDATE_PRODUCT_SUCCESS"; payload: ProductInterface }
    | { type: "DELETE_PRODUCT_SUCCESS"; payload: number }
    | { type: "RESET" };

// ============ INTERFACES DE HOOKS ============
export interface UseCategoryReturn {
    categoria: CategoryInterface | null;
    categoriaPadre: CategoryInterface | null;
    subcategorias: CategoryInterface[];
    loading: boolean;
    error: string | null;
    retry: () => void;
}

export interface UseProductsReturn {
    productos: ProductInterface[];
    loading: boolean;
    error: string | null;
    retry: () => void;
}

// ✅ NUEVO: Hook para productos con filtros de localidad
export interface UseProductsWithLocalidadReturn extends UseProductsReturn {
    loadProductsByLocalidad: (
        localidadId: number,
        filters?: Omit<SearchFiltersWithLocalidad, "localidad">
    ) => Promise<void>;
    currentLocalidad: number | null;
}
