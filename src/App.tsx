import React from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { CartProvider } from "./context/GestionCarrito";
import { CartSidebar } from "./components/CarritoSidebar";
import { Home } from "./pages/Home";
import { Checkout } from "./pages/Checkout";
import { OrderComplete } from "./pages/OrderComplete";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { UserPanel } from "./pages/UserPanel";
import { RecoverPassword } from "./pages/RecoverPassword";

const appContainer = {
  minHeight: "100vh",
  background: "#efe6d1",
  color: "#3f2a17",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 18px",
  background: "linear-gradient(90deg,#5b3f2a,#3a2412)",
  color: "#f7efe0",
};

const headerLeft = { display: "flex", gap: 12, alignItems: "center" };

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header style={headerStyle}>
      <div style={headerLeft}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Tienda de Objetos de Fantasía</div>
        <div style={{ fontSize: 13, opacity: 0.9 }}>Objetos de prueba</div>
      </div>
      <nav style={{ display: "flex", gap: 10 }}>
        <Link to="/" style={linkStyle}>Tienda</Link>
        <Link to="/checkout" style={linkStyle}>Checkout</Link>

        {user ? (
          <>
            <Link to="/panel" style={linkStyle}>Panel</Link>
            <button onClick={handleLogout} style={buttonStyle}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/register" style={linkStyle}>Registro</Link>
          </>
        )}
      </nav>
    </header>
  );
}

const linkStyle = {
  color: "#f7efe0",
  textDecoration: "none",
  padding: "8px 10px",
  borderRadius: 6,
  background: "rgba(255,255,255,0.04)",
};

const buttonStyle = {
  color: "#f7efe0",
  background: "rgba(255,255,255,0.04)",
  border: "none",
  padding: "8px 10px",
  borderRadius: 6,
  cursor: "pointer",
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div style={appContainer}>
            <Navigation />
            <CartSidebar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-complete" element={<OrderComplete />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/panel" element={<UserPanel />} />
                <Route path="/recover" element={<RecoverPassword />} />
              </Routes>
            </main>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

