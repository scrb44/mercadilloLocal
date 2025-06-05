// src/pages/vendorProducts/components/LoadingState.tsx

import React from "react";
import classes from "../../../pages/vendorProducts/vendorProducts.module.css";

function LoadingState() {
    return (
        <div className={classes.loadingState}>
            <div className={classes.loadingSpinner}></div>
            <p>Cargando tus productos...</p>
        </div>
    );
}

export default LoadingState;
