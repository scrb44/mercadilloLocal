// src/App.tsx - ROLLBACK a estructura que funcionaba + PaymentProvider solo en checkout + MunicipioModal

import { useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, useUser, CartProvider } from "./contexts";
import { MunicipioProvider } from "./contexts/municipioContext";
import { VendorProductsProvider } from "./contexts/vendorProductsContext";

// Guards y Error Handling
import MunicipioGuard from "./componentes/municipioGuard";
import ErrorBoundary, { NotFoundPage } from "./componentes/errorBoundary";

// Solo importamos componentes críticos para la carga inicial
import Home from "./pages/home";
import MunicipioModal from "./componentes/municipioSelectorModal";
import WhoWeAre from "./pages/whoWeAre";

// Lazy loading para páginas no críticas
const CategoryProducts = lazy(() => import("./pages/categoryProducts"));
const ProductDetail = lazy(() => import("./pages/productDetail"));
const Cart = lazy(() => import("./pages/cart"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Perfil = lazy(() => import("./pages/perfil"));
const Checkout = lazy(() => import("./pages/checkout"));
const MisCompras = lazy(() => import("./pages/misCompras"));

// Lazy loading para páginas de vendedores
const VendorProducts = lazy(() => import("./pages/vendorProducts"));
const CreateProduct = lazy(() => import("./pages/createProduct"));
const EditProduct = lazy(() => import("./pages/editProduct"));

// Componente de loading optimizado
const PageSuspense = ({ children }: { children: React.ReactNode }) => (
    <Suspense
        fallback={
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "50vh",
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "16px",
                    margin: "20px",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "4px solid rgba(37, 99, 235, 0.3)",
                        borderTop: "4px solid #2563eb",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                ></div>
            </div>
        }
    >
        {children}
    </Suspense>
);

function AppContent() {
    const { user, isAuthenticated } = useUser();

    useEffect(() => {
        // CSS para la animación de loading
        const style = document.createElement("style");
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        return () => {
            document.head.removeChild(style);
        };
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [user]);

    return (
        <MunicipioProvider>
            {/* Modal del municipio - Se renderiza SIEMPRE, fuera del Router */}
            <MunicipioModal />

            <BrowserRouter>
                <ErrorBoundary>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route
                            path="/login"
                            element={
                                <PageSuspense>
                                    <Login />
                                </PageSuspense>
                            }
                        />
                        <Route
                            path="/registro"
                            element={
                                <PageSuspense>
                                    <Register />
                                </PageSuspense>
                            }
                        />

                        {/* ✅ RUTAS CON CART - Solo para usuarios autenticados */}
                        {isAuthenticated && user ? (
                            <Route
                                path="/*"
                                element={
                                    <MunicipioGuard>
                                        <CartProvider user={user}>
                                            <VendorProductsProvider>
                                                <Routes>
                                                    <Route
                                                        path="/"
                                                        element={<Home />}
                                                    />
                                                    <Route
                                                        path="/quienes-somos"
                                                        element={<WhoWeAre />}
                                                    />
                                                    <Route
                                                        path="/categoria/:categoryId"
                                                        element={
                                                            <PageSuspense>
                                                                <CategoryProducts />
                                                            </PageSuspense>
                                                        }
                                                    />
                                                    <Route
                                                        path="/producto/:productId"
                                                        element={
                                                            <PageSuspense>
                                                                <ProductDetail />
                                                            </PageSuspense>
                                                        }
                                                    />
                                                    <Route
                                                        path="/perfil"
                                                        element={
                                                            <PageSuspense>
                                                                <Perfil />
                                                            </PageSuspense>
                                                        }
                                                    />
                                                    <Route
                                                        path="/carrito"
                                                        element={
                                                            <PageSuspense>
                                                                <Cart />
                                                            </PageSuspense>
                                                        }
                                                    />

                                                    {/* ✅ CHECKOUT con PaymentProvider propio */}
                                                    <Route
                                                        path="/checkout"
                                                        element={
                                                            <PageSuspense>
                                                                <Checkout />
                                                            </PageSuspense>
                                                        }
                                                    />

                                                    <Route
                                                        path="/mis-compras"
                                                        element={
                                                            <PageSuspense>
                                                                <MisCompras />
                                                            </PageSuspense>
                                                        }
                                                    />

                                                    {/* Rutas de vendedores */}
                                                    <Route
                                                        path="/mis-productos"
                                                        element={
                                                            <PageSuspense>
                                                                <VendorProducts />
                                                            </PageSuspense>
                                                        }
                                                    />
                                                    <Route
                                                        path="/subir-producto"
                                                        element={
                                                            <PageSuspense>
                                                                <CreateProduct />
                                                            </PageSuspense>
                                                        }
                                                    />
                                                    <Route
                                                        path="/editar-producto/:productId"
                                                        element={
                                                            <PageSuspense>
                                                                <EditProduct />
                                                            </PageSuspense>
                                                        }
                                                    />
                                                    <Route
                                                        path="*"
                                                        element={
                                                            <NotFoundPage />
                                                        }
                                                    />
                                                </Routes>
                                            </VendorProductsProvider>
                                        </CartProvider>
                                    </MunicipioGuard>
                                }
                            />
                        ) : (
                            // ✅ RUTAS SIN CART - Para usuarios no autenticados
                            <>
                                <Route
                                    path="/"
                                    element={
                                        <MunicipioGuard>
                                            <Home />
                                        </MunicipioGuard>
                                    }
                                />
                                <Route
                                    path="/quienes-somos"
                                    element={
                                        <MunicipioGuard>
                                            <WhoWeAre />
                                        </MunicipioGuard>
                                    }
                                />
                                <Route
                                    path="/categoria/:categoryId"
                                    element={
                                        <MunicipioGuard>
                                            <PageSuspense>
                                                <CategoryProducts />
                                            </PageSuspense>
                                        </MunicipioGuard>
                                    }
                                />
                                <Route
                                    path="/producto/:productId"
                                    element={
                                        <MunicipioGuard>
                                            <PageSuspense>
                                                <ProductDetail />
                                            </PageSuspense>
                                        </MunicipioGuard>
                                    }
                                />

                                {/* ✅ Carrito para no autenticados - mostrar que necesitan login */}
                                <Route
                                    path="/carrito"
                                    element={
                                        <MunicipioGuard>
                                            <PageSuspense>
                                                <Cart />
                                            </PageSuspense>
                                        </MunicipioGuard>
                                    }
                                />

                                <Route path="*" element={<NotFoundPage />} />
                            </>
                        )}
                    </Routes>
                </ErrorBoundary>
            </BrowserRouter>
        </MunicipioProvider>
    );
}

// ✅ Componente principal de la aplicación
function App() {
    useEffect(() => {
        // Configurar interceptor de Axios para manejar errores globalmente
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // Manejar errores de autenticación globalmente
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];

                    // Solo redirigir si no estamos ya en login
                    if (!window.location.pathname.includes("/login")) {
                        window.location.href = "/login";
                    }
                }
                return Promise.reject(error);
            }
        );

        // Limpiar interceptor al desmontar
        return () => {
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

export default App;
