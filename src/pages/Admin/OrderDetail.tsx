import { useParams, Link } from "react-router-dom";
import { orders } from "../../data/mockData";
import { useState } from "react";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const orderData = orders.find((o) => o.id === Number(id));
  const [estado, setEstado] = useState(orderData?.estado);

  if (!orderData) {
    return <p className="p-6 text-red-500">Orden no encontrada</p>;
  }

  const cancelarOrden = () => {
    setEstado("Cancelada");
    alert(`Orden #${orderData.id} cancelada`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">
        Detalle de Orden #{orderData.id}
      </h2>
      <p><strong>Cliente:</strong> {orderData.cliente}</p>
      <p><strong>Total:</strong> ${orderData.total}</p>
      <p><strong>Fecha:</strong> {orderData.fecha}</p>
      <p><strong>Estado:</strong> {estado}</p>

      {estado !== "Cancelada" && (
        <button
          onClick={cancelarOrden}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Cancelar orden
        </button>
      )}

      <Link to="/admin/ordenes" className="text-blue-600 underline mt-4 block">
        ← Volver al listado
      </Link>
    </div>
  );
};
