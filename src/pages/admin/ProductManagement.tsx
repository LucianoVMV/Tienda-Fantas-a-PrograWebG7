import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import type { Product } from '../../data/productos'; // Asegúrate que esta ruta es correcta

const API_URL = 'http://localhost:5000/api';

export const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  // Estados para el modal de "Agregar"
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Estados para el modal de "Editar"
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Cargar productos desde el backend
  const fetchProducts = () => {
    fetch(`${API_URL}/admin/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error al cargar productos:", error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setName(''); setCategory(''); setPrice(''); setDescription(''); setImage('');
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
    
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    });
    
    if (response.ok) {
      fetchProducts(); // Recargamos la lista de productos
      setIsAddModalOpen(false);
    } else {
      console.error("Error al agregar el producto");
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    const updatedProductData = { name, category, price, description, image };

    const response = await fetch(`${API_URL}/products/${currentProduct.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProductData),
    });

    if (response.ok) {
      fetchProducts(); // Recargamos la lista
      setIsEditModalOpen(false);
    } else {
      console.error("Error al editar el producto");
    }
  };

  const handleToggleActive = async (productId: number) => {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      fetchProducts(); // Recargamos la lista
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
            <th>Estado</th> {/* <-- 1. NUEVA COLUMNA */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            // 2. AÑADIMOS UNA CLASE SI EL PRODUCTO ESTÁ INACTIVO
            <tr key={product.id} className={product.isActive === false ? 'product-inactive' : ''}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.category || 'N/A'}</td>
              <td>S/ {product.price.toFixed(2)}</td>
              {/* 3. MOSTRAMOS EL TEXTO DEL ESTADO */}
              <td>{product.isActive === false ? 'Inactivo' : 'Activo'}</td>
              <td className="action-buttons">
                <button className="admin-button" onClick={() => openEditModal(product)}>Editar</button>
                {/* 4. BOTÓN INTELIGENTE QUE CAMBIA */}
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
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
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
                <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
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
