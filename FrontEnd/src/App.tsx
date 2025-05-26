import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider, useUser, CartProvider } from "./contexts";

import Home from "./pages/home";
// import CartPage from "./pages/cart/CartPage";
// import LoginPage from "./pages/auth/LoginPage";

// Componente interno que necesita acceso al usuario
function AppContent() {
    const { user, isAuthenticated } = useUser();

    return (
        <Router>
            {/* Solo mostrar CartProvider si el usuario está autenticado */}
            {isAuthenticated && user ? (
                <CartProvider userId={user.id}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        {/* <Route path="/cart" element={<CartPage />} /> */}
                        {/* <Route path="/login" element={<LoginPage />} /> */}
                        {/* Más rutas aquí */}
                    </Routes>
                </CartProvider>
            ) : (
                <Routes>
                    <Route path="/" element={<Home />} />
                    {/* <Route path="/login" element={<LoginPage />} /> */}
                    {/* Rutas sin carrito para usuarios no autenticados */}
                </Routes>
            )}
        </Router>
    );
}

function App() {
    return (
        <UserProvider>
            <AppContent />
        </UserProvider>
    );
}

export default App;
