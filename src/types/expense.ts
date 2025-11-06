export interface Expense {
  id: string;
  user_id: string;
  titulo: string;
  precio: number;
  fecha: string;
  categoria: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  fechaCreacion: string;
}
