import React, { createContext, useState, useContext } from 'react';
import { products as mockProducts, categories as mockCategories, users as mockUsers, orders as mockOrders } from '../data/mockData';
import type { Product, Category, User, Order } from '../data/mockData';

interface DataContextType {
  products: Product[];
  categories: Category[];
  users: User[];
  orders: Order[];
  addProduct: (productData: Omit<Product, 'id' | 'isActive'>) => void;
  updateProduct: (productId: number, productData: Partial<Product>) => void;
  toggleProductActive: (productId: number) => void;
  addCategory: (categoryData: Omit<Category, 'id'>) => void;
  updateCategory: (categoryId: number, categoryData: Partial<Category>) => void;
  deleteCategory: (categoryId: number) => void;
  toggleUserActive: (userId: number) => void;
  cancelOrder: (orderId: number) => void;
  // --- NUEVAS FUNCIONES ---
  addUser: (userData: { nombre: string, correo: string }) => void;
  addOrder: (orderData: Omit<Order, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  // --- Funciones para modificar los datos ---

  const addProduct = (productData: Omit<Product, 'id' | 'isActive'>) => {
    const newProduct: Product = { id: Date.now(), ...productData, isActive: true };
    setProducts(prev => [...prev, newProduct]);
  };
  const updateProduct = (productId: number, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, ...productData } : p));
  };
  const toggleProductActive = (productId: number) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, isActive: !p.isActive, isNew: false } : p));
  };
  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = { id: Date.now(), ...categoryData };
    setCategories(prev => [...prev, newCategory]);
  };
  const updateCategory = (categoryId: number, categoryData: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === categoryId ? { ...c, ...categoryData } : c));
  };
  const deleteCategory = (categoryId: number) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };
  const toggleUserActive = (userId: number) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, activo: !u.activo } : u));
  };
  const cancelOrder = (orderId: number) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, estado: 'Cancelada' } : o));
  };
  
  // --- LÓGICA FINAL PARA AGREGAR USUARIOS Y ÓRDENES ---
  const addUser = (userData: { nombre: string, correo: string }) => {
    const newUser: User = { id: Date.now(), ...userData, activo: true };
    setUsers(prev => [...prev, newUser]);
  };

  const addOrder = (orderData: Omit<Order, 'id'>) => {
    const newOrder: Order = { id: Date.now(), ...orderData };
    setOrders(prev => [...prev, newOrder]);
  };

  const value = { products, categories, users, orders, addProduct, updateProduct, toggleProductActive, addCategory, updateCategory, deleteCategory, toggleUserActive, cancelOrder, addOrder, addUser };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData debe ser usado dentro de un DataProvider");
  return context;
};