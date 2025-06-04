// src/componentes/CategoryList/index.tsx - MEJORADO CON SUBCATEGORÍAS
import { useNavigate } from "react-router-dom";
import { type CategoryInterface } from "../../types/types";
import classes from "./categoryList.module.css";
import { PlaceholderURL } from "../../constants";

interface CategoryListProps {
    categories: CategoryInterface[];
    loading: boolean;
    error: string | null;
    onRetry?: () => void;
    showSubcategories?: boolean;
    parentCategory?: CategoryInterface | null;
}

function CategoryList({
    categories,
    loading,
    error,
    onRetry,
    showSubcategories = false,
    parentCategory,
}: CategoryListProps) {
    const navigate = useNavigate();

    const handleCategoryClick = (category: CategoryInterface) => {
        navigate(`/categoria/${category.id}`);
    };

    // Separar categorías principales de subcategorías
    const mainCategories = categories.filter((cat) => !cat.fatherId);
    const subcategories = categories.filter((cat) => cat.fatherId);

    // Determinar qué categorías mostrar según el contexto
    let categoriesToShow: CategoryInterface[] = [];

    if (showSubcategories && parentCategory) {
        // Modo subcategorías: mostrar solo las subcategorías de la categoría padre
        categoriesToShow = subcategories.filter(
            (cat) => cat.fatherId === parentCategory.id
        );
    } else {
        // Modo normal: mostrar solo categorías principales
        categoriesToShow = mainCategories;
    }

    // Estado de carga
    if (loading) {
        return (
            <div className={classes.loadingContainer}>
                <div className={classes.loadingSpinner}></div>
                <p className={classes.loadingText}>
                    Cargando{" "}
                    {showSubcategories ? "subcategorías" : "categorías"}...
                </p>
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
    if (categoriesToShow.length === 0) {
        return (
            <div className={classes.emptyContainer}>
                <span className={classes.emptyIcon}>📂</span>
                <p className={classes.emptyText}>
                    {showSubcategories
                        ? `No se encontraron subcategorías para ${parentCategory?.name}`
                        : "No se encontraron categorías"}
                </p>
            </div>
        );
    }

    return (
        <div className={classes.categoryListContainer}>
            {/* Título de la sección si estamos mostrando subcategorías */}
            {showSubcategories && parentCategory && (
                <div className={classes.subcategoryHeader}>
                    <h3 className={classes.subcategoryTitle}>
                        Subcategorías de {parentCategory.name}
                    </h3>
                </div>
            )}

            {/* Grid principal de categorías */}
            <div className={classes.categoryList}>
                {categoriesToShow.map((category) => {
                    // Contar subcategorías para cada categoría principal (solo si no estamos en modo subcategorías)
                    const categorySubcategories = showSubcategories
                        ? []
                        : subcategories.filter(
                              (sub) => sub.fatherId === category.id
                          );

                    return (
                        <div
                            key={category.id}
                            className={`${classes.categoryCard} ${
                                showSubcategories ? classes.subcategoryCard : ""
                            }`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            <div className={classes.categoryContent}>
                                {category.img ? (
                                    <img
                                        src={category.img}
                                        alt={category.name}
                                        className={classes.categoryImage}
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                PlaceholderURL;
                                        }}
                                    />
                                ) : (
                                    <div
                                        className={classes.categoryPlaceholder}
                                    >
                                        {showSubcategories ? "📁" : "🏷️"}
                                    </div>
                                )}

                                <div className={classes.categoryInfo}>
                                    <h3 className={classes.categoryName}>
                                        {category.name}
                                    </h3>

                                    {/* Mostrar cantidad de subcategorías solo si es categoría principal y no estamos en modo subcategorías */}
                                    {!showSubcategories &&
                                        categorySubcategories.length > 0 && (
                                            <span
                                                className={
                                                    classes.subcategoryCount
                                                }
                                            >
                                                {categorySubcategories.length}{" "}
                                                subcategoría
                                                {categorySubcategories.length !==
                                                1
                                                    ? "s"
                                                    : ""}
                                            </span>
                                        )}

                                    {/* Indicador si es subcategoría */}
                                    {showSubcategories && (
                                        <span
                                            className={
                                                classes.subcategoryIndicator
                                            }
                                        >
                                            Subcategoría
                                        </span>
                                    )}
                                </div>

                                {/* Flecha para indicar que se puede hacer click */}
                                <div className={classes.categoryArrow}>→</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* NO mostrar subcategorías adicionales si showSubcategories es false */}
            {!showSubcategories && subcategories.length > 0 && false && (
                <div className={classes.subcategoriesSection}>
                    <h3 className={classes.sectionTitle}>
                        Todas las subcategorías
                    </h3>
                    <div className={classes.subcategoriesGrid}>
                        {subcategories.map((subcategory) => {
                            const parentCat = mainCategories.find(
                                (cat) => cat.id === subcategory.fatherId
                            );

                            return (
                                <div
                                    key={subcategory.id}
                                    className={`${classes.categoryCard} ${classes.subcategoryCard}`}
                                    onClick={() =>
                                        handleCategoryClick(subcategory)
                                    }
                                >
                                    <div className={classes.categoryContent}>
                                        <div
                                            className={
                                                classes.categoryPlaceholder
                                            }
                                        >
                                            📁
                                        </div>
                                        <div className={classes.categoryInfo}>
                                            <h4
                                                className={
                                                    classes.subcategoryName
                                                }
                                            >
                                                {subcategory.name}
                                            </h4>
                                            <span
                                                className={
                                                    classes.parentCategoryName
                                                }
                                            >
                                                en {parentCat?.name}
                                            </span>
                                        </div>
                                        <div className={classes.categoryArrow}>
                                            →
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryList;
