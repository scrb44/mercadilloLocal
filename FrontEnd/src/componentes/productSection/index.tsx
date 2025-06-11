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
