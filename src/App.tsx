import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { CartProvider } from "./context/GestionCarrito";
import { CartSidebar } from "./components/CarritoSidebar";
import { Home } from "./pages/Home";
import { Checkout } from "./pages/Checkout";
import { OrderComplete } from "./pages/OrderComplete";
import { Dashboard } from "./pages/admin/Dashboard";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { ProductManagement } from "./pages/admin/ProductManagement";
import { CategoryManagement } from "./pages/admin/CategoryManagement";

const appContainer: React.CSSProperties = {
  minHeight: "100vh",
  background: "#efe6d1", 
  color: "#3f2a17",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 18px",
  background: "linear-gradient(90deg,#5b3f2a,#3a2412)",
  color: "#f7efe0",
};

const headerLeft: React.CSSProperties = { display: "flex", gap: 12, alignItems: "center" };

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div style={appContainer}>
          <header style={headerStyle}>
            <div style={headerLeft}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>Tienda de Objetos de Fantasía</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>Objetos de prueba</div>
            </div>
            <nav style={{ display: "flex", gap: 10 }}>
              <Link to="/" style={{ color: "#f7efe0", textDecoration: "none", padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)" }}>Tienda</Link>
              <Link to="/checkout" style={{ color: "#f7efe0", textDecoration: "none", padding: "8px 10px", borderRadius: 6, background: "rgba(255,255,255,0.04)" }}>Checkout</Link>
            </nav>
          </header>

          <CartSidebar />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-complete" element={<OrderComplete />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="products" element={<ProductManagement />} />
                <Route path="categories" element={<CategoryManagement />} />
              </Route>
            </Routes>
          </main>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
