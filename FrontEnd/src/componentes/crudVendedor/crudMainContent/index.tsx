// src/pages/vendorProducts/components/MainContent.tsx

import React from "react";
import {
    type ProductInterface,
    type VendorProductsState,
} from "../../../types/types";
import ProductCard from "../crudProductCard";
import LoadingState from "../crudLoadingState";
import EmptyState from "../crudEmptyState";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface MainContentProps {
    products: ProductInterface[];
    searchQuery: string;
    state: VendorProductsState;
    onCreateNew: () => void;
    onEditProduct: (productId: number) => void;
    onDeleteProduct: (productId: number) => void;
    onViewProduct: (productId: number) => void;
    onClearSearch: () => void;
}

function MainContent({
    products,
    searchQuery,
    state,
    onCreateNew,
    onEditProduct,
    onDeleteProduct,
    onViewProduct,
    onClearSearch,
}: MainContentProps) {
    if (state.loading) {
        return <LoadingState />;
    }

    if (products.length === 0) {
        return (
            <EmptyState
                searchQuery={searchQuery}
                onCreateNew={onCreateNew}
                onClearSearch={onClearSearch}
            />
        );
    }

    return (
        <div className={classes.mainContent}>
            <div className={classes.productsGrid}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isUpdating={state.updating}
                        isDeleting={state.deleting}
                        onEdit={() => onEditProduct(product.id)}
                        onDelete={() => onDeleteProduct(product.id)}
                        onView={() => onViewProduct(product.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default MainContent;
