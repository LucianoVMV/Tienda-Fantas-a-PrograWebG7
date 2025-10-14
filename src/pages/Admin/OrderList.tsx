import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Order {
  id: number;
  cliente: string;
  total: number;
  estado: string;
  fecha: string;
}

const API_URL = "http://localhost:5001/api/admin/orders";

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);
  
  return (
    
    <div className="product-management">
      <div className="header-actions">
          <h1>Gestión de Órdenes</h1>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.cliente}</td>
              <td>S/ {o.total.toFixed(2)}</td>
              <td>{o.estado}</td>
              <td>{o.fecha}</td>
              <td className="action-buttons">
                <button
                  onClick={() => navigate(`/admin/ordenes/${o.id}`)}
                  className="admin-button"
                >
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};