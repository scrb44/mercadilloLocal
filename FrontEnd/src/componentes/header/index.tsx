// src/componentes/header/index.tsx - ACTUALIZADO CON ENLACE PARA VENDEDORES
import { Link, useNavigate } from "react-router-dom";
import { useUser, useCart } from "../../contexts";
import MunicipioIndicator from "../municipioIndicator";
import classes from "./header.module.css";

function Header() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useUser();

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    // Solo usar cart si el usuario está autenticado
    const cart = isAuthenticated ? useCart() : null;

    // Verificar si el usuario es vendedor
    const isVendor = user?.role === "VENDEDOR";

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
  <Link to="/quienes-somos" className={classes["page-header__link"]}>
    ¿Quiénes somos?
  </Link>
</li>


                    {/* Enlace PERFIL solo si está autenticado */}
                    {isAuthenticated && (
                        <li>
                            <Link
                                to="/perfil"
                                className={classes["page-header__link"]}
                            >
                                Mi perfil
                            </Link>
                        </li>
                    )}

                    {/* Enlace PARA VENDEDORES - solo si es vendedor */}
                    {isAuthenticated && isVendor && (
                        <li>
                            <Link
                                to="/mis-productos"
                                className={classes["page-header__vendor-link"]}
                                title="Gestiona tus productos"
                            >
                                📦 Mis Productos
                            </Link>
                        </li>
                    )}

                    {isAuthenticated ? (
                        <>
                            <li className={classes["page-header__user"]}>
                                Hola, {user?.usuario}
                                {isVendor && (
                                    <span className={classes["vendor-badge"]}>
                                        • Vendedor
                                    </span>
                                )}
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
