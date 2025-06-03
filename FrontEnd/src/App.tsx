// src/App.tsx - ACTUALIZADO CON RUTAS DE PAGO

import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, CartProvider, useUser } from "./contexts";
import { MunicipioProvider } from "./contexts/municipioContext";
import { PaymentProvider } from "./contexts/paymentContext";

// Guards y Error Handling
import MunicipioGuard from "./componentes/municipioGuard";
import ErrorBoundary, { NotFoundPage } from "./componentes/errorBoundary";

// Páginas existentes
import Home from "./pages/home";
import CategoryProducts from "./pages/categoryProducts";
import ProductDetail from "./pages/productDetail";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import Perfil from "./pages/perfil";
import MunicipioSelector from "./pages/municipioSelector";

// Nueva página de checkout
import Checkout from "./pages/checkout";

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
                    // Usuario autenticado - con carrito y pagos
                    <Route
                        path="/*"
                        element={
                            <MunicipioGuard>
                                <CartProvider userId={user.id}>
                                    <PaymentProvider>
                                        <Routes>
                                            <Route
                                                path="/"
                                                element={<Home />}
                                            />
                                            <Route
                                                path="/categoria/:categoryId"
                                                element={<CategoryProducts />}
                                            />
                                            <Route
                                                path="/producto/:productId"
                                                element={<ProductDetail />}
                                            />
                                            <Route
                                                path="/perfil"
                                                element={<Perfil />}
                                            />
                                            <Route
                                                path="/carrito"
                                                element={<Cart />}
                                            />

                                            {/* NUEVAS RUTAS DE PAGO */}
                                            <Route
                                                path="/checkout"
                                                element={<Checkout />}
                                            />
                                            <Route
                                                path="/pago"
                                                element={<Checkout />}
                                            />
                                            <Route
                                                path="/pago/confirmacion"
                                                element={<Checkout />}
                                            />

                                            <Route
                                                path="/login"
                                                element={<Login />}
                                            />
                                            <Route
                                                path="/registro"
                                                element={<Register />}
                                            />
                                            <Route
                                                path="*"
                                                element={<NotFoundPage />}
                                            />
                                        </Routes>
                                    </PaymentProvider>
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
                            path="/categoria/:categoryId"
                            element={
                                <MunicipioGuard>
                                    <CategoryProducts />
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="/producto/:productId"
                            element={
                                <MunicipioGuard>
                                    <ProductDetail />
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="/carrito"
                            element={
                                <MunicipioGuard>
                                    <Cart />
                                </MunicipioGuard>
                            }
                        />

                        {/* Redirigir checkout a login si no está autenticado */}
                        <Route
                            path="/checkout"
                            element={
                                <MunicipioGuard>
                                    <Login />
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="/pago"
                            element={
                                <MunicipioGuard>
                                    <Login />
                                </MunicipioGuard>
                            }
                        />

                        <Route
                            path="/login"
                            element={
                                <MunicipioGuard>
                                    <Login />
                                </MunicipioGuard>
                            }
                        />
                        <Route
                            path="/registro"
                            element={
                                <MunicipioGuard>
                                    <Register />
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
