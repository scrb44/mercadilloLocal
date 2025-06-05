// src/App.tsx - OPTIMIZADO PARA CARGA INICIAL RÁPIDA

import { useEffect, lazy, Suspense } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, CartProvider, useUser } from "./contexts";
import { MunicipioProvider } from "./contexts/municipioContext";

// Guards y Error Handling
import MunicipioGuard from "./componentes/municipioGuard";
import ErrorBoundary, { NotFoundPage } from "./componentes/errorBoundary";

// Solo importamos componentes críticos para la carga inicial
import Home from "./pages/home";
import MunicipioSelector from "./pages/municipioSelector";
import WhoWeAre from "./pages/whoWeAre"; // Importa tu componente "Quiénes Somos"

// Lazy loading para páginas no críticas
const CategoryProducts = lazy(() => import("./pages/categoryProducts"));
const ProductDetail = lazy(() => import("./pages/productDetail"));
const Cart = lazy(() => import("./pages/cart"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));
const Perfil = lazy(() => import("./pages/perfil"));
const Checkout = lazy(() => import("./pages/checkout"));

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

// Lazy loading para PaymentProvider solo cuando se necesite
const LazyPaymentProvider = lazy(() =>
    import("./contexts/paymentContext").then((module) => ({
        default: ({ children }: { children: React.ReactNode }) => (
            <module.PaymentProvider>{children}</module.PaymentProvider>
        ),
    }))
);

function AppContent() {
    const { user, isAuthenticated } = useUser();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common["Authorization"];
        }
    }, [user]);

    return (
        <div className="App">
            <Routes>
                {/* Ruta especial para selección de municipio (sin guard) */}
                <Route
                    path="/seleccionar-municipio"
                    element={<MunicipioSelector />}
                />

                {/* Todas las demás rutas protegidas por MunicipioGuard */}
                {isAuthenticated && user ? (
                    // Usuario autenticado - con carrito y pagos lazy
                    <Route
                        path="/*"
                        element={
                            <MunicipioGuard>
                                <CartProvider userId={user.id}>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
                                         <Route path="/quienes-somos" element={<WhoWeAre />} />
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

                                        {/* RUTAS DE PAGO CON LAZY LOADING */}
                                        <Route
                                            path="/checkout"
                                            element={
                                                <PageSuspense>
                                                    <Suspense
                                                        fallback={
                                                            <div>
                                                                Cargando sistema
                                                                de pagos...
                                                            </div>
                                                        }
                                                    >
                                                        <LazyPaymentProvider>
                                                            <Checkout />
                                                        </LazyPaymentProvider>
                                                    </Suspense>
                                                </PageSuspense>
                                            }
                                        />
                                        <Route
                                            path="/pago"
                                            element={
                                                <PageSuspense>
                                                    <Suspense
                                                        fallback={
                                                            <div>
                                                                Cargando sistema
                                                                de pagos...
                                                            </div>
                                                        }
                                                    >
                                                        <LazyPaymentProvider>
                                                            <Checkout />
                                                        </LazyPaymentProvider>
                                                    </Suspense>
                                                </PageSuspense>
                                            }
                                        />
                                        <Route
                                            path="/pago/confirmacion"
                                            element={
                                                <PageSuspense>
                                                    <Suspense
                                                        fallback={
                                                            <div>
                                                                Cargando
                                                                confirmación...
                                                            </div>
                                                        }
                                                    >
                                                        <LazyPaymentProvider>
                                                            <Checkout />
                                                        </LazyPaymentProvider>
                                                    </Suspense>
                                                </PageSuspense>
                                            }
                                        />

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
                                        <Route
                                            path="*"
                                            element={<NotFoundPage />}
                                        />
                                    </Routes>
                                </CartProvider>
                            </MunicipioGuard>
                        }
                    />
                ) : (
                    // Usuario no autenticado - sin carrito ni pagos
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

                        {/* Redirigir checkout a login si no está autenticado */}
                        <Route
                            path="/checkout"
                            element={
                                <MunicipioGuard>
                                    <PageSuspense>
                                        <Login />
                                    </PageSuspense>
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="/pago"
                            element={
                                <MunicipioGuard>
                                    <PageSuspense>
                                        <Login />
                                    </PageSuspense>
                                </MunicipioGuard>
                            }
                        />

                        <Route
                            path="/login"
                            element={
                                <MunicipioGuard>
                                    <PageSuspense>
                                        <Login />
                                    </PageSuspense>
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="/registro"
                            element={
                                <MunicipioGuard>
                                    <PageSuspense>
                                        <Register />
                                    </PageSuspense>
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="*"
                            element={
                                <MunicipioGuard>
                                    <NotFoundPage />
                                </MunicipioGuard>
                            }
                        />
                    </>
                )}
            </Routes>
        </div>
    );
}

function App() {
    return (
        <MunicipioProvider>
            <ErrorBoundary>
                <UserProvider>
                    <BrowserRouter>
                        <AppContent />
                    </BrowserRouter>
                </UserProvider>
            </ErrorBoundary>
        </MunicipioProvider>
    );
}

export default App;