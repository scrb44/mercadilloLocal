// src/App.tsx - CORREGIDO: Sin Routes anidados
import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, CartProvider, useUser } from "./contexts";
import { MunicipioProvider } from "./contexts/municipioContext";

// Guards y Error Handling
import MunicipioGuard from "./componentes/municipioGuard";
import ErrorBoundary, { NotFoundPage } from "./componentes/errorBoundary";

// Páginas
import Home from "./pages/home";
import CategoryProducts from "./pages/categoryProducts";
import ProductDetail from "./pages/productDetail";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import Perfil from "./pages/perfil";
import MunicipioSelector from "./pages/municipioSelector";

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
                    // Usuario autenticado - con carrito
                    <Route
                        path="/*"
                        element={
                            <MunicipioGuard>
                                <CartProvider userId={user.id}>
                                    <Routes>
                                        <Route path="/" element={<Home />} />
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
                                </CartProvider>
                            </MunicipioGuard>
                        }
                    />
                ) : (
                    // Usuario no autenticado - sin carrito
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
