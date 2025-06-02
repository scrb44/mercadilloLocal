// src/componentes/index.ts - ACTUALIZADO CON MUNICIPIO

// Componentes básicos existentes
export { default as Header } from "./header";
export { default as Footer } from "./footer";
export { default as Filter } from "./filter";

// Listas existentes
export { default as CategoryList } from "./categoryList";
export { default as ProductList } from "./productList";

// Cards existentes
export { default as ProductCard } from "./productCard";

// Componentes nuevos modularizados
export { default as CategoryHeader } from "./categoryHeader";
export { default as ProductsSection } from "./productSection";
export { default as ProductGallery } from "./productGallery";
export { default as CartItem } from "./cartItem";

// Componentes de municipio
export { default as MunicipioIndicator } from "./municipioIndicator";

// Guards y Error Handling
export { default as MunicipioGuard } from "./municipioGuard";
export { default as ErrorBoundary, NotFoundPage } from "./errorBoundary";

// Navegación - breadcrumb exporta múltiples componentes
export {
    default as Breadcrumb,
    CategoryBreadcrumb,
    ProductBreadcrumb,
    SimpleBreadcrumb,
} from "./breadcrumb";
