import React from 'react';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Panel de Administrador</h1>
      <p className="admin-subtitle">Resumen de la tienda (datos de ejemplo)</p>
      
      <div className="summary-cards">
        <div className="card">
          <h3 className="card-title">Órdenes de Hoy</h3>
          <p className="card-value">15</p>
        </div>
        <div className="card">
          <h3 className="card-title">Usuarios Nuevos (Hoy)</h3>
          <p className="card-value">8</p>
        </div>
        <div className="card">
          <h3 className="card-title">Ingresos Totales (Hoy)</h3>
          <p className="card-value">S/ 2,850.00</p>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title-admin">Seleccionar Período</h2>
        <form className="period-form">
          <div className="form-group">
            <label htmlFor="start-date">Desde:</label>
            <input type="date" id="start-date" name="start-date" />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Hasta:</label>
            <input type="date" id="end-date" name="end-date" />
          </div>
          <button type="submit" className="admin-button">Filtrar</button>
        </form>
      </div>
    </div>
  );
};