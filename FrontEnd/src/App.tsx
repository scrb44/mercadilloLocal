import { useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider, CartProvider, useUser } from "./contexts";

// Páginas
import Home from "./pages/home";
import CategoryProducts from "./pages/categoryProducts";
import ProductDetail from "./pages/productDetail";
import Cart from "./pages/cart";
import Login from "./pages/login";
import Register from "./pages/register";
import Perfil from "./pages/perfil";

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
      {isAuthenticated && user ? (
        <CartProvider userId={user.id}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categoria/:categoryId" element={<CategoryProducts />} />
            <Route path="/producto/:productId" element={<ProductDetail />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
          </Routes>
        </CartProvider>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:categoryId" element={<CategoryProducts />} />
          <Route path="/producto/:productId" element={<ProductDetail />} />
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
    <UserProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
