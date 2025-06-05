// src/pages/vendorProducts/components/ControlsSection.tsx

import React from "react";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface ControlsSectionProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    totalProducts: number;
    filteredCount: number;
}

function ControlsSection({
    searchQuery,
    onSearchChange,
    totalProducts,
    filteredCount,
}: ControlsSectionProps) {
    return (
        <div className={classes.controlsSection}>
            <div className={classes.searchContainer}>
                <input
                    type="search"
                    placeholder="Buscar en tus productos..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className={classes.searchInput}
                />
                <span className={classes.searchIcon}>🔍</span>
            </div>

            <div className={classes.statsContainer}>
                <div className={classes.statCard}>
                    <span className={classes.statNumber}>{totalProducts}</span>
                    <span className={classes.statLabel}>Total Productos</span>
                </div>
                <div className={classes.statCard}>
                    <span className={classes.statNumber}>{filteredCount}</span>
                    <span className={classes.statLabel}>Mostrando</span>
                </div>
            </div>
        </div>
    );
}

export default ControlsSection;
