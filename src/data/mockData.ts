export interface User {
  id: number;
  nombre: string;
  correo: string;
  activo: boolean;
}

export interface Order {
  id: number;
  cliente: string;
  total: number;
  estado: string;
  fecha: string;
}

export const users: User[] = [
  { id: 1, nombre: "Juan Pérez", correo: "juan@correo.com", activo: true },
  { id: 2, nombre: "Ana Torres", correo: "ana@correo.com", activo: false },
  { id: 3, nombre: "Diego Paucar", correo: "diego@correo.com", activo: true },
];

export const orders: Order[] = [
  { id: 101, cliente: "Juan Pérez", total: 150.0, estado: "Completada", fecha: "2025-10-01" },
  { id: 102, cliente: "Ana Torres", total: 80.5, estado: "Cancelada", fecha: "2025-10-05" },
  { id: 103, cliente: "Diego Paucar", total: 120.0, estado: "Pendiente", fecha: "2025-10-07" },
];
