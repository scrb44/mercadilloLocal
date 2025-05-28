// src/componentes/categoryHeader/index.tsx
import { type CategoryInterface } from "../../types/types";
import classes from "./categoryHeader.module.css";

interface CategoryHeaderProps {
    categoria: CategoryInterface;
    categoriaPadre?: CategoryInterface | null;
    productCount: number;
    subcategoryCount: number;
}

function CategoryHeader({
    categoria,
    categoriaPadre,
    productCount,
    subcategoryCount,
}: CategoryHeaderProps) {
    return (
        <div className={classes.categoryHeader}>
            <div className={classes.categoryHeaderContent}>
                <div className={classes.categoryTitle}>
                    <h1 className={classes.categoryName}>{categoria.name}</h1>
                    {categoria.fatherId && (
                        <span className={classes.subcategoryBadge}>
                            Subcategoría
                        </span>
                    )}
                </div>
                <p className={classes.categorySubtitle}>
                    {categoria.fatherId
                        ? `Subcategoría de ${
                              categoriaPadre?.name || "Categoría principal"
                          }`
                        : `Explora todos los productos en ${categoria.name}`}
                </p>
                <div className={classes.categoryStats}>
                    {productCount > 0 && (
                        <span className={classes.statItem}>
                            📦 {productCount} producto
                            {productCount !== 1 ? "s" : ""}
                        </span>
                    )}
                    {subcategoryCount > 0 && (
                        <span className={classes.statItem}>
                            📁 {subcategoryCount} subcategoría
                            {subcategoryCount !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryHeader;
