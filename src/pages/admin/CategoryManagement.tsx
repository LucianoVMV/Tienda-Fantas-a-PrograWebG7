import React, { useState, useEffect } from 'react';
import './CategoryManagement.css';


interface Category {
  id: number;
  name: string;
  description: string;
}

const API_URL = 'http://localhost:5001/api/categories'; 

export const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchCategories = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setCategories(data));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setDescription('');
    setCurrentCategory(null);
  };

  const openModal = (category: Category | null) => {
    if (category) {
      setCurrentCategory(category);
      setName(category.name);
      setDescription(category.description);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isEditing = currentCategory !== null;
    const url = isEditing ? `${API_URL}/${currentCategory.id}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      fetchCategories();
      setIsModalOpen(false);
    } else {
      console.error("Error al guardar la categoría");
    }
  };
  
  const handleDelete = async (categoryId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
        const response = await fetch(`${API_URL}/${categoryId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            fetchCategories();
        } else {
            console.error("Error al eliminar la categoría");
        }
    }
  };


  return (
    <div className="category-management">
      <div className="header-actions">
        <h1>Gestión de Categorías</h1>
        <button className="admin-button success" onClick={() => openModal(null)}>Agregar Categoría</button>
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
                <button className="admin-button" onClick={() => openModal(category)}>Editar</button>
                <button className="admin-button danger" onClick={() => handleDelete(category.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{currentCategory ? 'Editar' : 'Agregar'} Categoría</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="admin-button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                        <button type="submit" className="admin-button success">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};
