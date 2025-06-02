// src/App.tsx - Configuración completa de rutas
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider, CartProvider, useUser } from "./contexts";

// Páginas
import Home from "./pages/home";
import CategoryProducts from "./pages/categoryProducts";
import ProductDetail from "./pages/productDetail";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import Perfil from "./pages/perfil"; // Ajusta la ruta

// Componente wrapper para manejar el CartProvider condicionalmente
function AppContent() {
    const { user, isAuthenticated } = useUser();

    return (
        <div className="App">
            {isAuthenticated && user ? (
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
                        <Route path="/perfil" element={<Perfil />} />
                        <Route path="/carrito" element={<Cart />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/registro" element={<Register />} />
                    </Routes>
                </CartProvider>
            ) : (
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
                    <Route path="/carrito" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registro" element={<Register />} />
                </Routes>
            )}
        </div>
    );
}

function App() {
    return (
        <Router>
            <UserProvider>
                <AppContent />
            </UserProvider>
        </Router>
    );
}

export default App;
