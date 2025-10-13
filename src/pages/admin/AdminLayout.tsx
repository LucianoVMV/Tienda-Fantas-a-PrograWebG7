import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './AdminLayout.css';

export const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="sidebar-title">Admin Panel</h2>
        <nav className="admin-nav">
          <NavLink to="/admin" end>Dashboard</NavLink>
          <NavLink to="/admin/products">Gestión de Productos</NavLink>
          <NavLink to="/admin/categories">Gestión de Categorías</NavLink>
        </nav>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
