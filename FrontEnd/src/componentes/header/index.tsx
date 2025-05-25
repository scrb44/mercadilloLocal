// import React from "react";
import { useUser, useCart } from "../../contexts";
import classes from "./header.module.css";

function Header() {
    // ============ CONTEXTS ============
    const { user, isAuthenticated, logout } = useUser();

    // Solo usar cart si el usuario está autenticado
    const cart = isAuthenticated ? useCart() : null;

    return (
        <header className={classes["page-header"]}>
            <h1>Mercadillo Local</h1>

            <ul className={classes["page-header__list"]}>
                <li>¿Quienes somos?</li>

                {/* Mostrar diferente contenido según autenticación */}
                {isAuthenticated ? (
                    <>
                        <li className={classes["page-header__user"]}>
                            Hola, {user?.name}
                        </li>
                        <li
                            className={classes["page-header__logout"]}
                            onClick={logout}
                            style={{ cursor: "pointer" }}
                        >
                            Cerrar sesión
                        </li>

                        {/* CARRITO CON DATOS REALES */}
                        <li className={classes["page-header__cart"]}>
                            Carrito ({cart?.totalItems || 0})
                            {/* Mostrar precio total si hay productos */}
                            {cart && cart.totalPrice > 0 && (
                                <span className={classes["cart-total"]}>
                                    - €{cart.totalPrice.toFixed(2)}
                                </span>
                            )}
                            {/* Indicadores de estado */}
                            {cart?.loading && (
                                <span className={classes["loading-indicator"]}>
                                    🔄
                                </span>
                            )}
                            {cart?.error && (
                                <span className={classes["error-indicator"]}>
                                    ⚠️
                                </span>
                            )}
                        </li>
                    </>
                ) : (
                    <>
                        <li className={classes["page-header__login"]}>
                            Iniciar sesión
                        </li>
                        <li className={classes["page-header__cart"]}>
                            Carrito (0)
                        </li>
                    </>
                )}
            </ul>
        </header>
    );
}

export default Header;
