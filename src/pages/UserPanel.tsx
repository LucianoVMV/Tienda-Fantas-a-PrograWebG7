import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  date: string;
  status: string;
  total?: number;
  items?: { product: { id: number; name: string; price: number }; quantity: number }[];
}

export const UserPanel: React.FC = () => {
  const auth = useAuth();
  const { user, updateUser, changePassword } = auth;
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState<string>(user?.name ?? "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const key = `orders_${user.email}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || "[]");
      setOrders(Array.isArray(saved) ? saved : []);
    } catch {
      setOrders([]);
    }
    setName(user.name || "");
  }, [user, navigate]);


  const handleUpdateName = () => {
    setMessage("");
    setError("");
    if (!name.trim()) return setError("El nombre no puede estar vacío.");
    if (!updateUser) return setError("Función updateUser no disponible.");
    updateUser({ name: name.trim() });
    setMessage("Nombre actualizado correctamente.");
  };


  const handleChangePassword = async () => {
    setMessage("");
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword)
      return setError("Completa todos los campos de contraseña.");
    if (newPassword !== confirmPassword)
      return setError("Las contraseñas nuevas no coinciden.");
    if (!changePassword) return setError("Función changePassword no disponible.");
    const res = await changePassword(user!.email, oldPassword, newPassword);
    if (!res.success) setError(res.message || "Error al cambiar contraseña.");
    else {
      setMessage(res.message || "Contraseña cambiada correctamente.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };


  const handleCancelProduct = (orderId: string, productId: number) => {
    const updatedOrders = orders
      .map(order => {
        if (order.id !== orderId || !order.items) return order;
        const filteredItems = order.items.filter(it => it.product.id !== productId);
        return { ...order, items: filteredItems };
      })
      .filter(order => order.items && order.items.length > 0); // eliminar órdenes vacías
    setOrders(updatedOrders);
    localStorage.setItem(`orders_${user!.email}`, JSON.stringify(updatedOrders));
    setMessage("Producto cancelado correctamente.");
  };

  if (!user) return null;

  const container = { maxWidth: 900, margin: "28px auto", padding: 16, fontFamily: "Arial, Helvetica, sans-serif" } as React.CSSProperties;
  const card = { background: "#fff8ec", padding: 14, borderRadius: 8, marginBottom: 14, border: "1px solid #e6d9bf" } as React.CSSProperties;
  const input = { width: "100%", padding: 8, borderRadius: 6, border: "1px solid #c7b39b", marginBottom: 8 } as React.CSSProperties;
  const btn = { padding: "8px 12px", borderRadius: 6, border: "none", cursor: "pointer" } as React.CSSProperties;

  return (
    <div style={container}>
      <h2 style={{ color: "#3f2a17", marginBottom: 8 }}>Panel del Usuario</h2>
      <p><strong>Nombre:</strong> {user.name}</p>
      <p style={{ marginTop: 4, color: "#5b4632" }}><strong>Correo:</strong> {user.email}</p>

      {message && <div style={{ color: "green", margin: "12px 0" }}>{message}</div>}
      {error && <div style={{ color: "red", margin: "12px 0" }}>{error}</div>}


      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Editar nombre</h3>
        <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={handleUpdateName} style={{ ...btn, background: "#5b3f2a", color: "#fff" }}>Guardar nombre</button>
      </div>


      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Cambiar contraseña</h3>
        <input style={input} type="password" placeholder="Contraseña actual" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        <input style={input} type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input style={input} type="password" placeholder="Confirmar nueva contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <button onClick={handleChangePassword} style={{ ...btn, background: "#3f2a17", color: "#fff" }}>Cambiar contraseña</button>
      </div>


      <div style={card}>
        <h3 style={{ marginTop: 0 }}>Tus órdenes y productos</h3>
        {orders.length === 0 ? (
          <p style={{ color: "#5b4632" }}>No tienes órdenes aún.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} style={{ marginBottom: 16, paddingBottom: 8, borderBottom: "1px dashed #6b4b2a" }}>
              <div style={{ marginBottom: 6, fontWeight: 700 }}>
                Orden #{order.id} - {order.date} - <em>{order.status || "Pendiente"}</em>
              </div>
              {order.items && order.items.map(it => (
                <div key={it.product.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span>{it.product.name} x {it.quantity}</span>
                  <span>S/ {(it.product.price * it.quantity).toFixed(2)}</span>
                  <button
                    onClick={() => handleCancelProduct(order.id, it.product.id)}
                    style={{ ...btn, background: "#8b1c1c", color: "#fff", marginLeft: 8 }}
                  >
                    Cancelar
                  </button>
                </div>
              ))}
              <div style={{ fontWeight: 700, marginTop: 4 }}>
                Total: S/ {order.items?.reduce((sum, it) => sum + it.product.price * it.quantity, 0).toFixed(2)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


