import { orders } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Gestión de Órdenes</h2>
      <table className="min-w-full border text-left">
        <thead>
          <tr className="bg-blue-200">
            <th className="p-2">ID</th>
            <th className="p-2">Cliente</th>
            <th className="p-2">Total</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.cliente}</td>
              <td className="p-2">${o.total}</td>
              <td className="p-2">{o.estado}</td>
              <td className="p-2">{o.fecha}</td>
              <td className="p-2">
                <button
                  onClick={() => navigate(`/admin/ordenes/${o.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
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
