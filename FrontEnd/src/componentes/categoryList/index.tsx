// src/componentes/CategoryList/index.tsx - SIMPLIFICADO
import { useNavigate } from "react-router-dom";
import { type CategoryInterface } from "../../types/types";
import classes from "./categoryList.module.css";
import { PlaceholderURL } from "../../constants";

interface CategoryListProps {
    categories: CategoryInterface[];
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
    horizontal?: boolean; // ✅ NUEVO: Para modo scroll horizontal
}

function CategoryList({
    categories,
    loading,
    error,
    onRetry,
    horizontal = false,
}: CategoryListProps) {
    const navigate = useNavigate();

    const handleCategoryClick = (category: CategoryInterface) => {
        navigate(`/categoria/${category.id}`);
    };

    // Solo mostrar categorías principales
    const mainCategories = categories.filter((cat) => !cat.fatherId);

    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <div className={classes.loadingSpinner}></div>
                <p>Cargando categorías...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={classes.errorContainer}>
                <span className={classes.errorIcon}>❌</span>
                <p>{error}</p>
                {onRetry && (
                    <button onClick={onRetry} className={classes.retryButton}>
                        🔄 Reintentar
                    </button>
                )}
            </div>
        );
    }

    if (mainCategories.length === 0) {
        return (
            <div className={classes.emptyContainer}>
                <span className={classes.emptyIcon}>📂</span>
                <p>No se encontraron categorías</p>
            </div>
        );
    }

    return (
        <div
            className={`${classes.categoryGrid} ${
                horizontal ? classes.horizontal : ""
            }`}
        >
            {mainCategories.map((category) => (
                <div
                    key={category.id}
                    className={classes.categoryCard}
                    onClick={() => handleCategoryClick(category)}
                    style={{
                        backgroundImage: `url(${
                            category.img || PlaceholderURL
                        })`,
                    }}
                >
                    <h3 className={classes.categoryName}>{category.name}</h3>
                    <span className={classes.categoryArrow}>→</span>
                </div>
            ))}
        </div>
    );
}

export default CategoryList;
