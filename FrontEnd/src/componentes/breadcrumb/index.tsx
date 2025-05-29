// src/componentes/breadcrumb/index.tsx
import { Link } from "react-router-dom";
import {
    type BreadcrumbProps,
    type BreadcrumbItem,
    type CategoryBreadcrumbProps,
    type ProductBreadcrumbProps,
    type SimpleBreadcrumbProps,
} from "../../types/types";
import classes from "./breadcrumb.module.css";

// Componente base de Breadcrumb
function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <nav className={classes.breadcrumb} aria-label="Navegación">
            {items.map((item, index) => (
                <span key={index} className={classes.breadcrumbItem}>
                    {item.path && !item.isActive ? (
                        <Link to={item.path} className={classes.breadcrumbLink}>
                            {item.label}
                        </Link>
                    ) : (
                        <span
                            className={
                                item.isActive
                                    ? classes.breadcrumbCurrent
                                    : classes.breadcrumbText
                            }
                        >
                            {item.label}
                        </span>
                    )}
                    {index < items.length - 1 && (
                        <span className={classes.breadcrumbSeparator}>›</span>
                    )}
                </span>
            ))}
        </nav>
    );
}

// Componente específico para breadcrumb de categorías
export function CategoryBreadcrumb({
    currentCategory,
    parentCategory,
}: CategoryBreadcrumbProps) {
    const items: BreadcrumbItem[] = [
        {
            label: "Inicio",
            path: "/",
        },
    ];

    // Añadir categoría padre si existe
    if (parentCategory) {
        items.push({
            label: parentCategory.name,
            path: `/categoria/${parentCategory.id}`,
        });
    }

    // Añadir categoría actual
    if (currentCategory) {
        items.push({
            label: currentCategory.name,
            isActive: true,
        });
    } else {
        items.push({
            label: "Cargando...",
            isActive: true,
        });
    }

    return <Breadcrumb items={items} />;
}

// Componente específico para breadcrumb de productos
export function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
    const items: BreadcrumbItem[] = [
        {
            label: "Inicio",
            path: "/",
        },
    ];

    // Si el producto tiene categorías, añadir la primera
    if (product.categories && product.categories.length > 0) {
        const category = product.categories[0];

        // Si la categoría tiene padre, añadirlo primero
        if (category.fatherId) {
            // Buscar la categoría padre (esto debería venir como prop en un caso real)
            // Por ahora, asumimos que tenemos acceso a ella
            items.push({
                label: "Categoría Principal", // Placeholder
                path: `/categoria/${category.fatherId}`,
            });
        }

        // Añadir la categoría del producto
        items.push({
            label: category.name,
            path: `/categoria/${category.id}`,
        });
    }

    // Añadir el producto actual
    items.push({
        label: product.name,
        isActive: true,
    });

    return <Breadcrumb items={items} />;
}

// Componente para breadcrumbs simples (Login, Cart, etc.)
export function SimpleBreadcrumb({
    pageName,
    parentPath,
    parentName,
}: SimpleBreadcrumbProps) {
    const items: BreadcrumbItem[] = [
        {
            label: "Inicio",
            path: "/",
        },
    ];

    // Añadir página padre si existe
    if (parentPath && parentName) {
        items.push({
            label: parentName,
            path: parentPath,
        });
    }

    // Añadir página actual
    items.push({
        label: pageName,
        isActive: true,
    });

    return <Breadcrumb items={items} />;
}

export default Breadcrumb;
