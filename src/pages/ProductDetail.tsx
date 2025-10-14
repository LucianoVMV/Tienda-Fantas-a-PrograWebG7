import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../data/productos';
import { useCart } from '../context/GestionCarrito';
import './ProductDetail.css';

const API_URL = "http://localhost:5001/api";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      
      fetch(`${API_URL}/products`)
        .then(res => res.json())
        .then((products: Product[]) => {
          const found = products.find(p => p.id === Number(id));
          setProduct(found || null);
        });
    }
  }, [id]);

  if (!product) return <div className="loading-detail">Cargando artefacto...</div>;

  return (
    <div className="product-detail-page">
      <div className="detail-layout">
        <div className="detail-image-container">
          <img src={product.image} alt={product.name} />
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