import React, { useState } from "react";
import { useCart } from "../context/GestionCarrito";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const Checkout: React.FC = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState<'qr'|'card'>('qr');
  const [shipping, setShipping] = useState<ShippingData>({ fullName: '', address: '', city: '', postalCode: '', country: '' });
  const [errors, setErrors] = useState<string | null>(null);

  const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0);
  const shippingCost = items.length > 0 ? 15 : 0;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.postalCode || !shipping.country) {
      setErrors("Completa todos los campos de envío.");
      return;
    }
    if (items.length === 0) {
      setErrors("El carrito está vacío.");
      return;
    }
    if (!user) {
      setErrors("No hay usuario activo.");
      return;
    }

    const order = {
      id: String(Date.now()),
      date: new Date().toLocaleString(),
      status: "Enviando",
      items,
      totals: { subtotal, shipping: shippingCost, total }
    };

    // --- Guardar la orden en localStorage ---
    const key = `orders_${user.email}`;
    let savedOrders: any[] = [];
    try {
      const saved = localStorage.getItem(key);
      if (saved) savedOrders = JSON.parse(saved);
    } catch { savedOrders = []; }

    savedOrders.push(order);
    localStorage.setItem(key, JSON.stringify(savedOrders));
    // -----------------------------------------

    clearCart();
    navigate('/order-complete', { state: { order } });
  };

  return (
    <div style={{ maxWidth: 820, margin: "28px auto", padding: 12 }}>
      <h2 style={{ color: "#3f2a17" }}>Checkout</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
        <div style={{ background: "#f7efe0", padding: 12, border: "1px solid #6b4b2a", borderRadius: 8 }}>
          <h3 style={{ marginBottom: 8 }}>Dirección de envío</h3>
          <input value={shipping.fullName} onChange={e => setShipping({...shipping, fullName: e.target.value})} placeholder="Nombre completo" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #c7b39b", marginBottom: 8 }} />
          <input value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} placeholder="Dirección" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #c7b39b", marginBottom: 8 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <input value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} placeholder="Ciudad" style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #c7b39b" }} />
            <input value={shipping.postalCode} onChange={e => setShipping({...shipping, postalCode: e.target.value})} placeholder="Código postal" style={{ width: 140, padding: 8, borderRadius: 6, border: "1px solid #c7b39b" }} />
          </div>
          <input value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} placeholder="País" style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #c7b39b", marginTop: 8 }} />
        </div>

        <div style={{ background: "#f7efe0", padding: 12, border: "1px solid #6b4b2a", borderRadius: 8 }}>
          <h3 style={{ marginBottom: 8 }}>Método de pago</h3>
          <label style={{ marginRight: 12 }}><input type="radio" checked={paymentMethod === 'qr'} onChange={() => setPaymentMethod('qr')} /> Código QR</label>
          <label><input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} /> Tarjeta</label>

          <div style={{ marginTop: 12 }}>
            {paymentMethod === 'qr' ? (
              <div style={{ textAlign: "center", padding: 10, border: "1px dashed #6b4b2a", borderRadius: 6 }}>
                <div style={{ marginBottom: 8 }}>Escanea este QR con tu app de pagos</div>
                <img src="https://placehold.co/200x200?text=QR" alt="QR" style={{ display: "inline-block" }} />
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                <input placeholder="Número de tarjeta" style={{ padding: 8, borderRadius: 6, border: "1px solid #c7b39b" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <input placeholder="MM/AA" style={{ padding: 8, borderRadius: 6, border: "1px solid #c7b39b", flex: 1 }} />
                  <input placeholder="CVC" style={{ padding: 8, borderRadius: 6, border: "1px solid #c7b39b", width: 120 }} />
                </div>
                <input placeholder="Nombre en la tarjeta" style={{ padding: 8, borderRadius: 6, border: "1px solid #c7b39b" }} />
              </div>
            )}
          </div>
        </div>

        <div style={{ background: "#f7efe0", padding: 12, border: "1px solid #6b4b2a", borderRadius: 8 }}>
          <h3 style={{ marginBottom: 8 }}>Resumen de la orden</h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div>Subtotal</div><div>S/ {subtotal.toFixed(2)}</div></div>
          <div style={{ display: "flex", justifyContent: "space-between" }}><div>Envío</div><div>S/ {shippingCost.toFixed(2)}</div></div>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, marginTop: 8 }}><div>Total</div><div>S/ {total.toFixed(2)}</div></div>
        </div>

        {errors && <div style={{ color: "#8b1c1c" }}>{errors}</div>}

        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" style={{ flex: 1, padding: 10, background: "#7b4f2a", color: "#fff", borderRadius: 8, border: "1px solid #613f23", cursor: "pointer" }}>Completar orden</button>
          <button type="button" onClick={() => navigate('/')} style={{ padding: 10, borderRadius: 8, border: "1px solid #613f23", background: "#f7efe0" }}>Volver</button>
        </div>
      </form>
    </div>
  );
};
