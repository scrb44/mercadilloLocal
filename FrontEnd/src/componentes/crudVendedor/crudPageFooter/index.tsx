// src/pages/vendorProducts/components/PageFooter.tsx

import React from "react";
import { Link } from "react-router-dom";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface PageFooterProps {
    filteredCount: number;
    totalCount: number;
    onRefresh: () => void;
    loading: boolean;
}

function PageFooter({
    filteredCount,
    totalCount,
    onRefresh,
    loading,
}: PageFooterProps) {
    return (
        <div className={classes.pageFooter}>
            <div className={classes.footerActions}>
                <button
                    onClick={onRefresh}
                    className={classes.refreshButton}
                    disabled={loading}
                >
                    🔄 Actualizar
                </button>
                <Link to="/perfil" className={classes.profileLink}>
                    👤 Mi Perfil
                </Link>
            </div>

            <div className={classes.footerStats}>
                <p className={classes.footerText}>
                    Mostrando {filteredCount} de {totalCount} productos
                </p>
            </div>
        </div>
    );
}

export default PageFooter;
