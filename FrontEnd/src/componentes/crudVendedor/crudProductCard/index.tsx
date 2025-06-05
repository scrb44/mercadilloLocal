// src/pages/vendorProducts/components/ProductCard.tsx

import React from "react";
import { type ProductInterface } from "../../../types/types";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface ProductCardProps {
    product: ProductInterface;
    isUpdating: boolean;
    isDeleting: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onView: () => void;
}

function ProductCard({
    product,
    isUpdating,
    isDeleting,
    onEdit,
    onDelete,
    onView,
}: ProductCardProps) {
    return (
        <div className={classes.productCard}>
            <div className={classes.productImage}>
                <img
                    src={product.img[0] || "/placeholder-image.jpg"}
                    alt={product.name}
                    onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                    }}
                />
                <div className={classes.productOverlay}>
                    <button
                        onClick={onEdit}
                        className={classes.editButton}
                        disabled={isUpdating}
                        title="Editar producto"
                    >
                        ✏️ Editar
                    </button>
                    <button
                        onClick={onDelete}
                        className={classes.deleteButton}
                        disabled={isDeleting}
                        title="Eliminar producto"
                    >
                        {isDeleting ? "🔄" : "🗑️"} Eliminar
                    </button>
                </div>
            </div>

            <div className={classes.productInfo}>
                <h3
                    className={classes.productName}
                    onClick={onView}
                    title="Ver producto"
                >
                    {product.name}
                </h3>
                <p className={classes.productDescription}>
                    {product.description}
                </p>

                <div className={classes.productCategories}>
                    {product.categories.slice(0, 2).map((category) => (
                        <span key={category.id} className={classes.categoryTag}>
                            {category.name}
                        </span>
                    ))}
                    {product.categories.length > 2 && (
                        <span className={classes.moreCategoriesTag}>
                            +{product.categories.length - 2} más
                        </span>
                    )}
                </div>

                <div className={classes.productFooter}>
                    <span className={classes.productPrice}>
                        €{product.price.toFixed(2)}
                    </span>
                    <div className={classes.productActions}>
                        <button onClick={onView} className={classes.viewButton}>
                            👁️ Ver
                        </button>
                        <button
                            onClick={onEdit}
                            className={classes.quickEditButton}
                            disabled={isUpdating}
                        >
                            ✏️
                        </button>
                    </div>
                </div>
            </div>

            {/* Indicador de estado de operaciones */}
            {(isUpdating || isDeleting) && (
                <div className={classes.operationOverlay}>
                    <div className={classes.operationSpinner}></div>
                </div>
            )}
        </div>
    );
}

export default ProductCard;
