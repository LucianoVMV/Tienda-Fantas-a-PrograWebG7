import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


interface User {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
}

const API_URL = "http://localhost:5001/api/admin/users";

export default function UserList() {
  const [userList, setUserList] = useState<User[]>([]);
  const navigate = useNavigate();

  
  const fetchUsers = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setUserList(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  
  const toggleActivo = (id: number) => {
    fetch(`${API_URL}/${id}/toggle`, { method: 'PUT' })
      .then(res => {
        if (res.ok) fetchUsers(); 
      });
  };

  return (
    
    <div className="product-management">
      <div className="header-actions">
        <h1>Gestión de Usuarios</h1>
      </div>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {userList.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.activo ? "Activo" : "Inactivo"}</td>
              <td className="action-buttons">
                <button
                  onClick={() => navigate(`/admin/usuarios/${u.id}`)}
                  className="admin-button"
                >
                  Ver Detalle
                </button>
                <button
                  onClick={() => toggleActivo(u.id)}
                  className={`admin-button ${u.activo ? "danger" : "success"}`}
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