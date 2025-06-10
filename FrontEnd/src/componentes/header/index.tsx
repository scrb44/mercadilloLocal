// src/componentes/header/index.tsx - ACTUALIZADO CON DROPDOWN
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import MunicipioIndicator from "../municipioIndicator";
import classes from "./header.module.css";

function Header() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    // Solo usar cart si el usuario está autenticado
    const cart = isAuthenticated ? useCart() : null;

    // Verificar si el usuario es vendedor
    const isVendor = user?.role === "VENDEDOR";

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const closeDropdown = () => {
        setDropdownOpen(false);
    };

    return (
        <header className={classes["page-header"]}>
            <div className={classes["page-header__content"]}>
                <div className={classes["page-header__left"]}>
                    <Link to="/" className={classes["page-header__logo"]}>
                        <h1>Mercadillo Local</h1>
                    </Link>

                    {/* Indicador de municipio */}
                    <div className={classes["page-header__municipio"]}>
                        <MunicipioIndicator
                            size="small"
                            style="chip"
                            showChangeButton={true}
                        />
                    </div>
                </div>

                <ul className={classes["page-header__list"]}>
                    <li>
                        <Link
                            to="/quienes-somos"
                            className={classes["page-header__link"]}
                        >
                            ¿Quiénes somos?
                        </Link>
                    </li>

                    {isAuthenticated ? (
                        <>
                            {/* Dropdown del usuario */}
                            <li
                                className={
                                    classes["page-header__user-dropdown"]
                                }
                                ref={dropdownRef}
                            >
                                <button
                                    className={
                                        classes["page-header__user-button"]
                                    }
                                    onClick={toggleDropdown}
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                >
                                    <span
                                        className={
                                            classes["page-header__user-text"]
                                        }
                                    >
                                        Hola, {user?.usuario}
                                    </span>
                                    <span className={classes["dropdown-arrow"]}>
                                        {dropdownOpen ? "▲" : "▼"}
                                    </span>
                                </button>

                                {/* Menú desplegable */}
                                {dropdownOpen && (
                                    <div className={classes["dropdown-menu"]}>
                                        <Link
                                            to="/perfil"
                                            className={classes["dropdown-item"]}
                                            onClick={closeDropdown}
                                        >
                                            👤 Mi perfil
                                        </Link>

                                        <Link
                                            to="/mis-compras"
                                            className={classes["dropdown-item"]}
                                            onClick={closeDropdown}
                                        >
                                            📋 Mis compras
                                        </Link>

                                        {/* Solo mostrar "Mis productos" si es vendedor */}
                                        {isVendor && (
                                            <Link
                                                to="/mis-productos"
                                                className={
                                                    classes["dropdown-item"]
                                                }
                                                onClick={closeDropdown}
                                            >
                                                📦 Mis productos
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </li>

                            <li>
                                <Link
                                    to="/carrito"
                                    className={classes["page-header__cart"]}
                                    aria-label="Ver carrito"
                                >
                                    🛒 Carrito ({cart?.totalItems || 0})
                                    {cart && cart.totalPrice > 0 && (
                                        <span className={classes["cart-total"]}>
                                            - €{cart.totalPrice.toFixed(2)}
                                        </span>
                                    )}
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

                            <li>
                                <button
                                    className={classes["page-header__logout"]}
                                    onClick={handleLogout}
                                    aria-label="Cerrar sesión"
                                >
                                    Cerrar sesión
                                </button>
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
