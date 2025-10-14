import React, { useState, useEffect } from 'react';
import './Dashboard.css';

interface SummaryData {
  totalOrders: number;
  newUsers: number | string;
  totalRevenue: number;
}

const API_URL = 'http://localhost:5001/api/admin/summary';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchSummary = (url: string = API_URL) => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(error => console.error("Error al cargar el resumen:", error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummary(); 
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    if (startDate && endDate) {
      const filteredUrl = `${API_URL}?from=${startDate}&to=${endDate}`;
      fetchSummary(filteredUrl);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1 className="admin-title">Panel de Administrador</h1>
      <p className="admin-subtitle">Resumen de la tienda</p>
      
      <div className="summary-cards">
        <div className="card">
          <h3 className="card-title">Órdenes</h3>
          <p className="card-value">{loading ? '...' : summary?.totalOrders}</p>
        </div>
        <div className="card">
          <h3 className="card-title">Usuarios Nuevos</h3>
          <p className="card-value">{loading ? '...' : summary?.newUsers}</p>
        </div>
        <div className="card">
          <h3 className="card-title">Ingresos Totales</h3>
          <p className="card-value">S/ {loading ? '...' : summary?.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="section-title-admin">Seleccionar Período</h2>
        <form className="period-form" onSubmit={handleFilter}>
          <div className="form-group">
            <label htmlFor="start-date">Desde:</label>
            <input 
              type="date" 
              id="start-date" 
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="end-date">Hasta:</label>
            <input 
              type="date" 
              id="end-date" 
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          <button type="submit" className="admin-button">Filtrar</button>
        </form>
      </div>
    </div>
  );
};