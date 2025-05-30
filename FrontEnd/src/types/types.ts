// src/types/types.ts - CENTRALIZADO COMPLETO

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

// Tipo del Context de carrito
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

// ============ INTERFACES DE USUARIO ============
export interface UserInterface {
  id: number;
  role: "COMPRADOR" | "ADMIN" | "VENDEDOR";
  usuario: string;
  nombre: string;
  email: string;
  password?: string;
  telf?: string;
  verificado?: boolean;
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

// Tipo del Context de usuario
export interface UserContextType {
    user: UserInterface | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

// ============ INTERFACES DE BÚSQUEDA/FILTROS ============
export interface SearchFiltersInterface {
    category?: number;
    vendor?: number;
    minPrice?: number;
    maxPrice?: number;
    query?: string;
}

// ============ INTERFACES DE COMPONENTES ============

// Breadcrumb
export interface BreadcrumbItem {
    label: string;
    path?: string;
    isActive?: boolean;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export interface CategoryBreadcrumbProps {
    currentCategory: CategoryInterface | null;
    parentCategory?: CategoryInterface | null;
}

export interface ProductBreadcrumbProps {
    product: ProductInterface;
}

export interface SimpleBreadcrumbProps {
    pageName: string;
    parentPath?: string;
    parentName?: string;
}

// CategoryList
export interface CategoryListProps {
    categories: CategoryInterface[];
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
    showSubcategories?: boolean;
    parentCategory?: CategoryInterface | null;
}

// ProductList
export interface ProductListProps {
    products: ProductInterface[];
    loading: boolean;
    error: string | null;
    onAddToCart?: (product: ProductInterface) => void;
    onRetry?: () => void;
}

// ProductCard
export interface ProductCardProps {
    product: ProductInterface;
    onAddToCart?: (product: ProductInterface) => void;
}

// CartItem
export interface CartItemProps {
    item: CartItemInterface;
    loading?: boolean;
    onUpdateQuantity: (productId: number, quantity: number) => void;
    onRemove: (productId: number) => void;
}

// CategoryHeader
export interface CategoryHeaderProps {
    categoria: CategoryInterface;
    categoriaPadre?: CategoryInterface | null;
    productCount: number;
    subcategoryCount: number;
}

// ProductGallery
export interface ProductGalleryProps {
    images: string[];
    productName: string;
}

// ProductsSection
export interface ProductsSectionProps {
    products: ProductInterface[];
    categoria: CategoryInterface;
    searchQuery: string;
    loading: boolean;
    error: string | null;
    onAddToCart: (product: ProductInterface) => void;
    onRetry: () => void;
    onClearSearch: () => void;
}

// Filter
export interface FilterProps {
    onFiltersChange: (filters: SearchFiltersInterface) => void;
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

export interface UseProductReturn {
    producto: ProductInterface | null;
    loading: boolean;
    error: string | null;
    retry: () => void;
}

export interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    handleChange: (name: keyof T, value: any) => void;
    validate: () => boolean;
    reset: () => void;
    setErrors: (errors: Partial<Record<keyof T, string>>) => void;
}
