import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import type { Product } from '../../data/productos';

// Definimos una interface simple para las categorías aquí mismo
interface Category {
  id: number;
  name: string;
}

const API_BASE_URL = 'http://localhost:5001/api';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const fetchAllData = () => {
    Promise.all([
      fetch(`${API_BASE_URL}/admin/products`),
      fetch(`${API_BASE_URL}/categories`)
    ])
    .then(async ([productsRes, categoriesRes]) => {
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(productsData);
      setCategories(categoriesData);
    })
    .catch(error => console.error("Error al cargar datos iniciales:", error));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const resetForm = () => {
    setName(''); setCategory(''); setPrice(''); setDescription(''); setImage('');
    setCurrentProduct(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setName(product.name);
    setCategory(product.category || '');
    setPrice(product.price.toString());
    setDescription(product.description || '');
    setImage(product.image || '');
    setIsEditModalOpen(true);
  };
  
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct = { name, category, price, description, image };
    
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    
    if (response.ok) {
      fetchAllData();
      setIsAddModalOpen(false);
    } else {
      console.error("Error al agregar el producto");
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    const updatedProductData = { name, category, price, description, image };

    const response = await fetch(`${API_BASE_URL}/products/${currentProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProductData),
    });

    if (response.ok) {
      fetchAllData();
      setIsEditModalOpen(false);
    } else {
      console.error("Error al editar el producto");
    }
  };

  const handleToggleActive = async (productId: number) => {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchAllData();
    } else {
      console.error("Error al cambiar el estado del producto");
    }
  };


  return (
    <div className="product-management">
      <div className="header-actions">
        <h1>Gestión de Productos</h1>
        <button className="admin-button success" onClick={openAddModal}>Agregar Producto</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={product.isActive === false ? 'product-inactive' : ''}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category || 'N/A'}</td>
              <td>S/ {product.price.toFixed(2)}</td>
              <td>{product.isActive === false ? 'Inactivo' : 'Activo'}</td>
              <td className="action-buttons">
                <button className="admin-button" onClick={() => openEditModal(product)}>Editar</button>
                <button 
                  className={`admin-button ${product.isActive === false ? 'success' : 'danger'}`}
                  onClick={() => handleToggleActive(product.id)}
                >
                  {product.isActive === false ? 'Activar' : 'Desactivar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- MODAL DE AGREGAR --- */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Nuevo Producto</h2>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
               <div className="form-group">
                <label>URL de la Imagen</label>
                <input type="text" value={image} onChange={e => setImage(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-button" onClick={() => setIsAddModalOpen(false)}>Cancelar</button>
                <button type="submit" className="admin-button success">Guardar Producto</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE EDITAR --- */}
      {isEditModalOpen && currentProduct && (
         <div className="modal-overlay">
          <div className="modal-content">
            <h2>Editar Producto</h2>
            <form onSubmit={handleEditProduct}>
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="" disabled>Selecciona una categoría</option>
                    {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                </select>
              </div>
              <div className="form-group">
                <label>Precio</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required step="0.01" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)}></textarea>
              </div>
               <div className="form-group">
                <label>URL de la Imagen</label>
                <input type="text" value={image} onChange={e => setImage(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="admin-button" onClick={() => setIsEditModalOpen(false)}>Cancelar</button>
                <button type="submit" className="admin-button success">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};