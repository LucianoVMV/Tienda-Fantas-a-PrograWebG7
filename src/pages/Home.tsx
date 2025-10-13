import React from "react";
import { PRODUCTS } from "../data/productos";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext"; // 👈 Importamos el hook del contexto

import { PRODUCTS } from "../data/productos";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from '../components/SearchBar';
import React, { useState } from "react";
// AÑADIMOS la importación del nuevo CSS
import './Home.css'; 

// Mantenemos los estilos que ya estaban por si se usan en otros sitios
const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto", // Margin ajustado para que el banner ocupe todo el ancho
  padding: "24px 12px",
};

export const Home: React.FC = () => {
  const { user } = useAuth(); 

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#3f2a17" }}>Tienda de objetos fantásticos</div>
          <div style={{ color: "#5b4632" }}>Objetos de fantasía</div>
        </div>

        <div style={{ color: "#5b4632" }}>
          Usuario: {user ? user.name : "Invitado"}
        </div>
      </div>
  // AÑADIMOS la lógica para filtrar productos
  // Debajo de la línea 'export const Home: React.FC = () => {'
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const bestSellers = PRODUCTS.filter(p => p.isBestSeller).slice(0, 12);
  const newArrivals = PRODUCTS.filter(p => p.isNew).slice(0, 6);

  return (
    // AÑADIMOS la clase 'home-page' para el fondo
    <div className="home-page">

      {/* AÑADIMOS el banner */}
      <header className="hero-section">
        <h1 className="hero-title">Mercancía mística... garantizamos casi todo</h1>
        <p className="hero-subtitle">No nos hacemos responsables de efectos secundarios mágicos.</p>
      </header>
      <SearchBar />

      <div style={containerStyle}></div>

      <div style={containerStyle}>
        {/* El header original se mantiene intacto */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#3f2a17" }}>Tienda de objetos fantasticos</div>
            <div style={{ color: "#5b4632" }}>Objetos de fantasía </div>
          </div>
          <div style={{ color: "#5b4632" }}>Usuario: Invitado</div>
        </div>

        {/* AÑADIMOS la sección de Más Vendidos */}
        <section>
          <h2 className="section-title">Los Más Vendidos</h2>
          <div className="product-grid">
            {bestSellers.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>

        {/* AÑADIMOS la sección de Nuevos Productos */}
        <section>
          <h2 className="section-title">Nuevos Productos</h2>
          <div className="product-grid">
            {newArrivals.map(p => <ProductCard key={p.id} p={p} />)}
          </div>
        </section>
      </div>
      <section>
      <h2 className="section-title">Nuestro Catálogo Completo</h2>
      <div className="product-grid">
        {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
      <section>
      <h2 className="section-title">Catálogo Interactivo</h2>
      <div className="category-filters">
        <button onClick={() => setSelectedCategory(null)}>Todos</button>
        <button onClick={() => setSelectedCategory('Armas')}>Armas</button>
        <button onClick={() => setSelectedCategory('Pociones')}>Pociones</button>
        <button onClick={() => setSelectedCategory('Armaduras')}>Armaduras</button>
        <button onClick={() => setSelectedCategory('Amuletos')}>Amuletos</button>
      </div>
      <div className="product-grid">
        {PRODUCTS
          .filter(p => selectedCategory ? p.category === selectedCategory : true)
          .map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>

      {/* AÑADIMOS el footer */}
      <footer className="footer">
        <p>&copy; 2025 Tienda de Objetos de Fantasía. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};