// src/pages/vendorProducts/components/ErrorBanner.tsx

import React from "react";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

interface ErrorBannerProps {
    error: string;
    onRetry: () => void;
}

function ErrorBanner({ error, onRetry }: ErrorBannerProps) {
    return (
        <div className={classes.errorBanner}>
            <span className={classes.errorIcon}>⚠️</span>
            <span className={classes.errorText}>{error}</span>
            <button onClick={onRetry} className={classes.retryButton}>
                🔄 Reintentar
            </button>
        </div>
    );
}

export default ErrorBanner;
