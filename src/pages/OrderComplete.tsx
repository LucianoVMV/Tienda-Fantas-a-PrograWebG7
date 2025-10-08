
import React from "react";
import { Link, useLocation } from "react-router-dom";

export const OrderComplete: React.FC = () => {
  const location = useLocation();
  const state = (location.state as any) || {};
  const order = state.order;

  if (!order) {
    return (
      <div style={{ maxWidth: 820, margin: "28px auto", padding: 12 }}>
        <h2 style={{ color: "#3f2a17" }}>No hay detalles de la orden</h2>
        <p>Probablemente llegaste aquí sin completar una compra.</p>
        <Link to="/" style={{ display: "inline-block", marginTop: 12, padding: "8px 12px", background: "#7b4f2a", color: "#fff", textDecoration: "none", borderRadius: 6 }}>Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: "28px auto", padding: 12 }}>
      <h2 style={{ color: "#3f2a17" }}>Gracias por tu compra</h2>
      <p>Orden ID: <strong>{order.id}</strong></p>

      <div style={{ background: "#f7efe0", padding: 12, border: "1px solid #6b4b2a", borderRadius: 8 }}>
        <h3>Resumen</h3>
        <ul style={{ paddingLeft: 16 }}>
          {order.items.map((it: any) => (
            <li key={it.product.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed #6b4b2a" }}>
              <span>{it.product.name} x {it.quantity}</span>
              <span>S/ {(it.product.price * it.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 8, fontWeight: 800 }}>Total pagado: S/ {order.totals.total.toFixed(2)}</div>
      </div>

      <Link to="/" style={{ display: "inline-block", marginTop: 12, padding: "8px 12px", background: "#613f23", color: "#fff", textDecoration: "none", borderRadius: 6 }}>Volver a la tienda</Link>
    </div>
  );
};
