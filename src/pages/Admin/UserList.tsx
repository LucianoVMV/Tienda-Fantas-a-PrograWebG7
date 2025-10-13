import { useState } from "react";
import { users as mockUsers } from "../../data/mockData";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [userList, setUserList] = useState(mockUsers);
  const navigate = useNavigate();

  const toggleActivo = (id: number) => {
    setUserList(userList.map(u =>
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Gestión de Usuarios</h2>
      <table className="min-w-full border text-left">
        <thead>
          <tr className="bg-blue-200">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((u) => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2">{u.activo ? "Activo" : "Inactivo"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Ver Detalle
                </button>
                <button
                  onClick={() => toggleActivo(u.id)}
                  className={`px-3 py-1 rounded ${u.activo ? "bg-red-400" : "bg-green-400"}`}
                >
                  {u.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
