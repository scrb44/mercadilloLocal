// src/componentes/index.ts - Barrel de componentes CORREGIDO

// Componentes básicos existentes
export { default as Header } from "./header";
export { default as Footer } from "./footer";
export { default as Filter } from "./filter";

// Listas existentes
export { default as CategoryList } from "./categoryList";
export { default as ProductList } from "./productList";

// Cards existentes
export { default as ProductCard } from "./productCard";

// Componentes nuevos modularizados (solo incluir si los has creado)
export { default as CategoryHeader } from "./categoryHeader";
export { default as ProductsSection } from "./productSection";
export { default as ProductGallery } from "./productGallery";
export { default as CartItem } from "./cartItem";

// Navegación - breadcrumb exporta múltiples componentes
export {
    default as Breadcrumb,
    CategoryBreadcrumb,
    ProductBreadcrumb,
    SimpleBreadcrumb,
} from "./breadcrumb";
