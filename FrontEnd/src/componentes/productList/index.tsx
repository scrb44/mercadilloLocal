import { type ProductInterface } from "../../types/types";
import ProductCard from "../productCard";
import classes from "./ProductList.module.css";

interface ProductListProps {
    products: ProductInterface[];
    loading: boolean;
    error: string | null;
    onAddToCart?: (product: ProductInterface) => void;
    onRetry?: () => void;
}

function ProductList({
    products,
    loading,
    error,
    onAddToCart,
    onRetry,
}: ProductListProps) {
    // Estado de carga
    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <div className={classes.loadingSpinner}></div>
                <p className={classes.loadingText}>Cargando productos...</p>
            </div>
        );
    }

    // Estado de error
    if (error) {
        return (
            <div className={classes.errorContainer}>
                <div className={classes.errorContent}>
                    <span className={classes.errorIcon}>❌</span>
                    <p className={classes.errorText}>{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className={classes.retryButton}
                        >
                            🔄 Reintentar
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Estado sin productos
    if (products.length === 0) {
        return (
            <div className={classes.emptyContainer}>
                <span className={classes.emptyIcon}>📦</span>
                <p className={classes.emptyText}>No se encontraron productos</p>
                <p className={classes.emptySubtext}>
                    Prueba a cambiar los filtros de búsqueda
                </p>
            </div>
        );
    }

    // Lista de productos
    return (
        <div className={classes.productList}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                />
            ))}
        </div>
    );
}

export default ProductList;
