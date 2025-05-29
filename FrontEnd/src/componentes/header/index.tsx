// src/componentes/header/index.tsx - ACTUALIZADO CON ESTRUCTURA PARA BANDA
import { Link } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import classes from "./header.module.css";

function Header() {
    // ============ CONTEXTS ============
    const { user, isAuthenticated, logout } = useUser();

    // Solo usar cart si el usuario está autenticado
    const cart = isAuthenticated ? useCart() : null;

    return (
        <header className={classes["page-header"]}>
            <div className={classes["page-header__content"]}>
                <Link to="/" className={classes["page-header__logo"]}>
                    <h1>Mercadillo Local</h1>
                </Link>

                <ul className={classes["page-header__list"]}>
                    <li>
                        <Link to="/" className={classes["page-header__link"]}>
                            ¿Quiénes somos?
                        </Link>
                    </li>

                    {/* Mostrar diferente contenido según autenticación */}
                    {isAuthenticated ? (
                        <>
                            <li className={classes["page-header__user"]}>
                                Hola, {user?.name}
                            </li>
                            <li>
                                <button
                                    className={classes["page-header__logout"]}
                                    onClick={logout}
                                    aria-label="Cerrar sesión"
                                >
                                    Cerrar sesión
                                </button>
                            </li>

                            {/* CARRITO - Solo para usuarios autenticados */}
                            <li>
                                <Link
                                    to="/carrito"
                                    className={classes["page-header__cart"]}
                                    aria-label="Ver carrito"
                                >
                                    🛒 Carrito ({cart?.totalItems || 0})
                                    {/* Mostrar precio total si hay productos */}
                                    {cart && cart.totalPrice > 0 && (
                                        <span className={classes["cart-total"]}>
                                            - €{cart.totalPrice.toFixed(2)}
                                        </span>
                                    )}
                                    {/* Indicadores de estado */}
                                    {cart?.loading && (
                                        <span
                                            className={
                                                classes["loading-indicator"]
                                            }
                                        >
                                            🔄
                                        </span>
                                    )}
                                    {cart?.error && (
                                        <span
                                            className={
                                                classes["error-indicator"]
                                            }
                                        >
                                            ⚠️
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    to="/login"
                                    className={classes["page-header__login"]}
                                >
                                    Iniciar sesión
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/registro"
                                    className={classes["page-header__link"]}
                                >
                                    Crear cuenta
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
}

export default Header;
