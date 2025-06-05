// src/pages/vendorProducts/components/PageHeader.tsx

import React from "react";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface PageHeaderProps {
    onCreateNew: () => void;
}

function PageHeader({ onCreateNew }: PageHeaderProps) {
    return (
        <div className={classes.pageHeader}>
            <div className={classes.headerContent}>
                <h1 className={classes.pageTitle}>📦 Gestión de Productos</h1>
                <p className={classes.pageSubtitle}>
                    Administra tu catálogo de productos en Mercadillo Local
                </p>
            </div>
            <button onClick={onCreateNew} className={classes.createButton}>
                ➕ Nuevo Producto
            </button>
        </div>
    );
}

export default PageHeader;
