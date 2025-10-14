import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext'; 
import { useCart } from '../context/GestionCarrito';
import './ProductDetail.css';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useData(); 
  const { addToCart } = useCart();

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <div className="loading-detail">Artefacto no encontrado...</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="detail-layout">
        <div className="detail-image-container">
          <img src={product.image || `https://via.placeholder.com/300x300.png?text=${product.name.replace(/\s/g, '+')}`} alt={product.name} />
        </div>
        <div className="detail-info">
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-category">{product.category}</p>
          <p className="detail-description">{product.description}</p>
          <p className="detail-price">S/ {product.price.toFixed(2)}</p>
          <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
            Agregar al Carrito
          </button>
          <Link to="/" className="back-link">← Volver a la tienda</Link>
        </div>
      </div>
    </div>
  );
};