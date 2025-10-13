import React from 'react';
import './CategoryManagement.css';

export const CategoryManagement: React.FC = () => {
  // Datos de ejemplo para las categorías
  const categories = [
    { id: 1, name: 'Armas', description: 'Instrumentos de combate cuerpo a cuerpo y a distancia.' },
    { id: 2, name: 'Pociones', description: 'Elixires con efectos mágicos variados.' },
    { id: 3, name: 'Armaduras', description: 'Equipamiento defensivo para aventureros.' },
    { id: 4, name: 'Amuletos', description: 'Objetos que otorgan bendiciones y protecciones.' },
  ];

  return (
    <div className="category-management">
      <div className="header-actions">
        <h1>Gestión de Categorías</h1>
        <button className="admin-button success">Agregar Categoría</button>
      </div>

      <table className="categories-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>{category.description}</td>
              <td className="action-buttons">
                <button className="admin-button">Editar</button>
                <button className="admin-button danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};