import React from "react";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from '../components/SearchBar';
import './Home.css';
import { useData } from "../context/DataContext"; 
import { Link } from "react-router-dom";
import type { Category } from "../data/mockData"; 

export const Home: React.FC = () => {
  
  const { products, categories } = useData();

  
  const bestSellers = products.filter(p => p.isBestSeller && p.isActive !== false).slice(0, 12);
  const newArrivals = products.filter(p => p.isNew && p.isActive !== false).slice(0, 6);
  const featuredCategories = categories.slice(0, 3);
  const newCategories = categories.slice(3, 6);

  return (
    <div className="home-page-final">
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Mercancía mística... garantizamos casi todo</h1>
          <p className="hero-subtitle">No nos hacemos responsables de efectos secundarios mágicos.</p>
        </div>
      </header>
      <SearchBar />

      <main className="home-container">
        <section className="home-section">
          <h2 className="home-section-title">Categorías Destacadas</h2>
          <div className="category-grid">
            {featuredCategories.map(cat => (
              <Link to={`/search?category=${cat.name}`} key={cat.name} className="category-panel-link">
                <div className="category-panel">
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="home-section">
          <h2 className="home-section-title">Los 12 Ítems Más Vendidos</h2>
          <div className="product-grid-home">
            {bestSellers.length > 0 ? bestSellers.map(p => <ProductCard key={p.id} p={p} />) : <p>Cargando...</p>}
          </div>
        </section>

        <section className="ad-banner">
            <div className="ad-banner-content">
                <h2>¡Oferta Semanal del Gremio!</h2>
                <p>¡20% de descuento en todas las pociones y elixires! Usa el código: AVENTURA2025</p>
                <Link to="/search?query=pociones" className="ad-banner-button">Ver Pociones en Oferta</Link>
            </div>
        </section>

        <div className="bottom-section">
            <section className="home-section">
            <h2 className="home-section-title">Categorías Nuevas</h2>
            <div className="category-grid">
                {newCategories.map(cat => (
                <Link to={`/search?category=${cat.name}`} key={cat.name} className="category-panel-link">
                    <div className="category-panel small">
                    <h3>{cat.name}</h3>
                    </div>
                </Link>
                ))}
            </div>
            </section>
            
            <section className="home-section">
            <h2 className="home-section-title">6 Productos Nuevos</h2>
            <div className="product-grid-home">
                {newArrivals.length > 0 ? newArrivals.map(p => <ProductCard key={p.id} p={p} />) : <p>Cargando...</p>}
            </div>
            </section>
        </div>
      </main>

      <footer className="footer-final">
        <div className="footer-links">
          <Link to="/about">Sobre Nosotros</Link>
          <Link to="/contact">Contacto</Link>
          <Link to="/terms">Términos y Condiciones</Link>
        </div>
        <p>&copy; 2025 Tienda de Objetos de Fantasía. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};