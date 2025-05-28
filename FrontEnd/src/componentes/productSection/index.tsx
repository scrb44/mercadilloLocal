// src/componentes/productsSection/index.tsx
import {
    type ProductInterface,
    type CategoryInterface,
} from "../../types/types";
import ProductList from "../productList";
import classes from "./productsSection.module.css";

interface ProductsSectionProps {
    products: ProductInterface[];
    categoria: CategoryInterface;
    searchQuery: string;
    loading: boolean;
    error: string | null;
    onAddToCart: (product: ProductInterface) => void;
    onRetry: () => void;
    onClearSearch: () => void;
}

function ProductsSection({
    products,
    categoria,
    searchQuery,
    loading,
    error,
    onAddToCart,
    onRetry,
    onClearSearch,
}: ProductsSectionProps) {
    return (
        <section className={classes.productsSection}>
            {/* Header de productos */}
            <div className={classes.productsHeader}>
                <h2 className={classes.productsTitle}>
                    {searchQuery
                        ? `Resultados para "${searchQuery}" en ${categoria.name}`
                        : `Productos ${categoria.fatherId ? "en" : "de"} ${
                              categoria.name
                          }`}
                </h2>
                {products.length > 0 && (
                    <span className={classes.productsCount}>
                        {products.length} producto
                        {products.length !== 1 ? "s" : ""}{" "}
                        {searchQuery ? "encontrado" : "disponible"}
                        {products.length !== 1 ? "s" : ""}
                    </span>
                )}
                {searchQuery && (
                    <button
                        onClick={onClearSearch}
                        className={classes.clearSearchButton}
                    >
                        ✕ Limpiar búsqueda
                    </button>
                )}
            </div>

            {/* Lista de productos */}
            <ProductList
                products={products}
                loading={loading}
                error={error}
                onAddToCart={onAddToCart}
                onRetry={onRetry}
            />
        </section>
    );
}

export default ProductsSection;
