export interface Expense {
  id: string;
  titulo: string;
  precio: number;
  fecha: string;
  categoria: string;
}

export interface Category {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  fechaCreacion: string;
}
