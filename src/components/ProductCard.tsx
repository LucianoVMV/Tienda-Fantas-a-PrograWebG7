import React from "react";
import type { Product } from "../data/productos";
import { useCart } from "../context/GestionCarrito";


const cardStyle: React.CSSProperties = {
  background: "#f7efe0", 
  border: "1px solid #6b4b2a",
  borderRadius: 8,
  overflow: "hidden",
  boxShadow: "2px 3px 8px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  height: 160,
  objectFit: "cover",
  display: "block",
};

const bodyStyle: React.CSSProperties = {
  padding: 12,
  display: "flex",
  flexDirection: "column",
  gap: 8,
  flex: 1,
};

export const ProductCard: React.FC<{ p: Product }> = ({ p }) => {
  const { addToCart } = useCart();

  return (
    <div style={cardStyle}>
      <img src={p.image} alt={p.name} style={imgStyle} />
      <div style={bodyStyle}>
        <div>
          <div style={{ fontWeight: 700 }}>{p.name}</div>
          <div style={{ color: "#5b4632", fontSize: 13 }}>{p.description}</div>
        </div>
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontWeight: 700 }}>S/ {p.price.toFixed(2)}</div>
          <button
            onClick={() => addToCart(p)}
            style={{
              background: "#b8860b",
              color: "#fff",
              border: "1px solid #6b4b2a",
              padding: "8px 10px",
              borderRadius: 6,
              cursor: "pointer",
              boxShadow: "inset 0 -2px rgba(0,0,0,0.15)",
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
