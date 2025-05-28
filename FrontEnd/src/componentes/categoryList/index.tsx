// src/componentes/CategoryList/index.tsx
import { useNavigate } from "react-router-dom";
import { type CategoryInterface } from "../../types/types";
import classes from "./categoryList.module.css";

interface CategoryListProps {
    categories: CategoryInterface[];
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
}

function CategoryList({
    categories,
    loading,
    error,
    onRetry,
}: CategoryListProps) {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryId: number) => {
        navigate(`/categoria/${categoryId}`);
    };

    // Estado de carga
    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <div className={classes.loadingSpinner}></div>
                <p className={classes.loadingText}>Cargando categorías...</p>
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

    // Estado sin categorías
    if (categories.length === 0) {
        return (
            <div className={classes.emptyContainer}>
                <span className={classes.emptyIcon}>📂</span>
                <p className={classes.emptyText}>
                    No se encontraron categorías
                </p>
            </div>
        );
    }

    // Grid de categorías
    return (
        <div className={classes.CategoryList}>
            {categories.map((category) => (
                <div
                    key={category.id}
                    className={classes.categoryCard}
                    onClick={() => handleCategoryClick(category.id)}
                >
                    <div className={classes.categoryContent}>
                        {category.img ? (
                            <img
                                src={category.img}
                                alt={category.name}
                                className={classes.categoryImage}
                            />
                        ) : (
                            <div className={classes.categoryPlaceholder}>
                                📁
                            </div>
                        )}
                        <h3 className={classes.categoryName}>
                            {category.name}
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default CategoryList;
