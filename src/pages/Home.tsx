import React from "react";
import { PRODUCTS } from "../data/productos";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext"; // 👈 Importamos el hook del contexto

const containerStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "24px auto",
  padding: 12,
};

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: 14,
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

      <h2 style={{ color: "#3f2a17", marginBottom: 8 }}>Catálogo</h2>
      <div style={gridStyle}>
        {PRODUCTS.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
};
