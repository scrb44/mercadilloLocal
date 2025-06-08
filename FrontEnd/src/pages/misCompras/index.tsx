// src/pages/misCompras/index.tsx - Página de historial de compras
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../../contexts";
import { SimpleBreadcrumb, Footer, Header } from "../../componentes";
import {
    pedidosService,
    type PedidoAPI,
    type EstadisticasPedidos,
    type ProductoPedido,
} from "../../services/pedidosService";

import classes from "./MisCompras.module.css";

function MisCompras() {
    const { user, isAuthenticated } = useUser();
    const [pedidos, setPedidos] = useState<PedidoAPI[]>([]);
    const [estadisticas, setEstadisticas] =
        useState<EstadisticasPedidos | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filtro, setFiltro] = useState<"todos" | "recientes">("todos");
    const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);

    // ============ CARGAR DATOS ============
    useEffect(() => {
        if (!isAuthenticated) return;

        const cargarDatos = async () => {
            try {
                setLoading(true);
                setError(null);

                const [pedidosData, estadisticasData] = await Promise.all([
                    filtro === "todos"
                        ? pedidosService.obtenerHistorial()
                        : pedidosService.obtenerPedidosRecientes(),
                    pedidosService.obtenerEstadisticas(),
                ]);

                setPedidos(pedidosData);
                setEstadisticas(estadisticasData);
            } catch (err: any) {
                console.error("❌ Error cargando datos:", err);
                setError(err.message || "Error al cargar los pedidos");
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [isAuthenticated, filtro]);

    // ============ HANDLERS ============
    const handleFiltroChange = (nuevoFiltro: "todos" | "recientes") => {
        setFiltro(nuevoFiltro);
        setPedidoExpandido(null); // Cerrar detalles al cambiar filtro
    };

    const togglePedidoExpandido = (pedidoId: number) => {
        setPedidoExpandido(pedidoExpandido === pedidoId ? null : pedidoId);
    };

    const parsearProductos = (productosJson: string): ProductoPedido[] => {
        return pedidosService.parsearProductos(productosJson);
    };

    // ============ RENDER STATES ============
    if (!isAuthenticated) {
        return (
            <div className={classes.page}>
                <Header />
                <div className={classes.container}>
                    <SimpleBreadcrumb pageName="Mis Compras" />
                    <div className={classes.unauthenticated}>
                        <h1>Mis Compras</h1>
                        <p>
                            Debes iniciar sesión para ver tu historial de
                            compras
                        </p>
                        <Link to="/login" className={classes.loginButton}>
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (loading) {
        return (
            <div className={classes.page}>
                <Header />
                <div className={classes.container}>
                    <SimpleBreadcrumb pageName="Mis Compras" />
                    <div className={classes.loading}>
                        <div className={classes.spinner}></div>
                        <p>Cargando tu historial de compras...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // ============ RENDER PRINCIPAL ============
    return (
        <div className={classes.page}>
            <Header />

            <div className={classes.container}>
                <SimpleBreadcrumb pageName="Mis Compras" />

                <div className={classes.header}>
                    <h1 className={classes.title}>Mis Compras</h1>
                    <p className={classes.subtitle}>
                        Hola {user?.nombre}, aquí tienes tu historial de compras
                    </p>
                </div>

                {/* Estadísticas */}
                {estadisticas && (
                    <div className={classes.estadisticas}>
                        <div className={classes.estadisticaCard}>
                            <span className={classes.estadisticaNumero}>
                                {estadisticas.totalPedidos}
                            </span>
                            <span className={classes.estadisticaLabel}>
                                Pedidos totales
                            </span>
                        </div>
                        <div className={classes.estadisticaCard}>
                            <span className={classes.estadisticaNumero}>
                                {estadisticas.pedidosPagados}
                            </span>
                            <span className={classes.estadisticaLabel}>
                                Compras exitosas
                            </span>
                        </div>
                        <div className={classes.estadisticaCard}>
                            <span className={classes.estadisticaNumero}>
                                {pedidosService.formatearPrecio(
                                    estadisticas.totalGastado
                                )}
                            </span>
                            <span className={classes.estadisticaLabel}>
                                Total gastado
                            </span>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className={classes.filtros}>
                    <button
                        onClick={() => handleFiltroChange("todos")}
                        className={`${classes.filtroButton} ${
                            filtro === "todos" ? classes.filtroActivo : ""
                        }`}
                    >
                        Todos los pedidos
                    </button>
                    <button
                        onClick={() => handleFiltroChange("recientes")}
                        className={`${classes.filtroButton} ${
                            filtro === "recientes" ? classes.filtroActivo : ""
                        }`}
                    >
                        Últimos 30 días
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className={classes.error}>
                        <span className={classes.errorIcon}>⚠️</span>
                        <span className={classes.errorText}>{error}</span>
                    </div>
                )}

                {/* Lista de pedidos */}
                {pedidos.length === 0 ? (
                    <div className={classes.empty}>
                        <span className={classes.emptyIcon}>📋</span>
                        <h2 className={classes.emptyTitle}>
                            No tienes compras registradas
                        </h2>
                        <p className={classes.emptyText}>
                            Cuando realices tu primera compra, aparecerá aquí
                        </p>
                        <Link to="/" className={classes.shopButton}>
                            Explorar productos
                        </Link>
                    </div>
                ) : (
                    <div className={classes.pedidosList}>
                        {pedidos.map((pedido) => {
                            const productos = parsearProductos(
                                pedido.productosJson
                            );
                            const isExpanded = pedidoExpandido === pedido.id;

                            return (
                                <div
                                    key={pedido.id}
                                    className={classes.pedidoCard}
                                >
                                    {/* Header del pedido */}
                                    <div
                                        className={classes.pedidoHeader}
                                        onClick={() =>
                                            togglePedidoExpandido(pedido.id)
                                        }
                                    >
                                        <div className={classes.pedidoInfo}>
                                            <div
                                                className={classes.pedidoNumero}
                                            >
                                                <strong>
                                                    #{pedido.numeroPedido}
                                                </strong>
                                            </div>
                                            <div
                                                className={classes.pedidoFecha}
                                            >
                                                {pedidosService.formatearFecha(
                                                    pedido.fechaPedido
                                                )}
                                            </div>
                                            <div
                                                className={
                                                    classes.pedidoCantidad
                                                }
                                            >
                                                {pedido.cantidadProductos}{" "}
                                                producto
                                                {pedido.cantidadProductos !== 1
                                                    ? "s"
                                                    : ""}
                                            </div>
                                        </div>
                                        <div className={classes.pedidoRight}>
                                            <div
                                                className={classes.pedidoTotal}
                                            >
                                                {pedidosService.formatearPrecio(
                                                    pedido.total
                                                )}
                                            </div>
                                            <div
                                                className={classes.pedidoEstado}
                                            >
                                                <span
                                                    className={`${
                                                        classes.estadoBadge
                                                    } ${
                                                        classes[
                                                            `estado${pedido.estadoPago}`
                                                        ]
                                                    }`}
                                                >
                                                    {pedido.estadoPago ===
                                                    "PAGADO"
                                                        ? "✅ Pagado"
                                                        : pedido.estadoPago}
                                                </span>
                                            </div>
                                            <div className={classes.expandIcon}>
                                                {isExpanded ? "▲" : "▼"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Detalles expandidos */}
                                    {isExpanded && (
                                        <div className={classes.pedidoDetalles}>
                                            {/* Información de entrega */}
                                            {pedido.direccionEntrega && (
                                                <div
                                                    className={
                                                        classes.entregaInfo
                                                    }
                                                >
                                                    <h4>
                                                        Información de entrega
                                                    </h4>
                                                    <p>
                                                        {
                                                            pedido.direccionEntrega
                                                        }
                                                        <br />
                                                        {
                                                            pedido.ciudadEntrega
                                                        }{" "}
                                                        {
                                                            pedido.codigoPostalEntrega
                                                        }
                                                        <br />
                                                        {pedido.telefonoEntrega &&
                                                            `Tel: ${pedido.telefonoEntrega}`}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Productos */}
                                            <div
                                                className={
                                                    classes.productosInfo
                                                }
                                            >
                                                <h4>Productos comprados</h4>
                                                <div
                                                    className={
                                                        classes.productosList
                                                    }
                                                >
                                                    {productos.map(
                                                        (producto, index) => (
                                                            <div
                                                                key={index}
                                                                className={
                                                                    classes.productoItem
                                                                }
                                                            >
                                                                {producto.imagen && (
                                                                    <img
                                                                        src={
                                                                            producto.imagen
                                                                        }
                                                                        alt={
                                                                            producto.nombre
                                                                        }
                                                                        className={
                                                                            classes.productoImagen
                                                                        }
                                                                    />
                                                                )}
                                                                <div
                                                                    className={
                                                                        classes.productoInfo
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            classes.productoNombre
                                                                        }
                                                                    >
                                                                        {
                                                                            producto.nombre
                                                                        }
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            classes.productoCantidad
                                                                        }
                                                                    >
                                                                        Cantidad:{" "}
                                                                        {
                                                                            producto.cantidad
                                                                        }
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        classes.productoPrecio
                                                                    }
                                                                >
                                                                    {pedidosService.formatearPrecio(
                                                                        producto.precio
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default MisCompras;
