// src/pages/vendorProducts/components/EmptyState.tsx

import React from "react";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface EmptyStateProps {
    searchQuery: string;
    onCreateNew: () => void;
    onClearSearch: () => void;
}

function EmptyState({
    searchQuery,
    onCreateNew,
    onClearSearch,
}: EmptyStateProps) {
    const isSearchEmpty = !searchQuery;

    return (
        <div className={classes.emptyState}>
            <span className={classes.emptyIcon}>📦</span>
            <h3 className={classes.emptyTitle}>
                {isSearchEmpty
                    ? "Aún no tienes productos"
                    : "No se encontraron productos"}
            </h3>
            <p className={classes.emptyText}>
                {isSearchEmpty
                    ? "¡Empieza subiendo tu primer producto al mercadillo!"
                    : `No hay productos que coincidan con "${searchQuery}"`}
            </p>

            {isSearchEmpty ? (
                <button
                    onClick={onCreateNew}
                    className={classes.createFirstButton}
                >
                    🚀 Subir mi primer producto
                </button>
            ) : (
                <button
                    onClick={onClearSearch}
                    className={classes.clearSearchButton}
                >
                    ✕ Limpiar búsqueda
                </button>
            )}
        </div>
    );
}

export default EmptyState;
