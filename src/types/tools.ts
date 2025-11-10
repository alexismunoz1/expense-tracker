import type { Expense, Category } from "./expense";

// === CONSTANTES DE ACCIONES ===

// Acciones disponibles para gestión de gastos
export const GASTO_ACCIONES = [
  "crear",
  "obtener",
  "modificar",
  "eliminar",
] as const;

// Acciones disponibles para gestión de categorías
export const CATEGORIA_ACCIONES = ["crear", "obtener"] as const;

// === TIPOS DERIVADOS DE CONSTANTES ===

export type GastoAccion = (typeof GASTO_ACCIONES)[number];
export type CategoriaAccion = (typeof CATEGORIA_ACCIONES)[number];

// === TIPOS DE DATOS ===

// Filtros para consultas de gastos
export interface FiltrosGasto {
  categoria?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

// Datos para operaciones de gastos
export interface DatosGasto {
  id?: string;
  ids?: string[]; // Para eliminación batch
  titulo?: string;
  precio?: number;
  divisa?: string;
  categoria?: string;
  filtros?: FiltrosGasto;
}

// Datos para operaciones de categorías
export interface DatosCategoria {
  nombre?: string;
  color?: string;
  icono?: string;
}

// === TIPOS DE INPUT PARA TOOLS ===

// Input para la herramienta gestionarGasto
export interface GestionarGastoInput {
  accion: GastoAccion;
  datos: DatosGasto;
}

// Input para la herramienta gestionarCategoria
export interface GestionarCategoriaInput {
  accion: CategoriaAccion;
  datos?: DatosCategoria;
}

// Input para procesar imagen de recibo
export interface ProcesarImagenReciboInput {
  imagenBase64: string;
  mimeType: string;
}

// Datos extraídos del OCR (usados cuando se requiere clarificación)
export interface ExtractedOcrData {
  amount: number;
  category: string;
  rawDescription: string;
  confidence: number;
}

// Respuesta del procesamiento de OCR
export interface OcrResult {
  requiresClarification: boolean;
  extractedData?: ExtractedOcrData;
  expense?: Expense;
  message: string;
}

// === TIPOS DE RESPUESTA ===

// Respuesta base para todas las operaciones
export interface BaseResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Respuesta específica para operaciones de gastos
export interface GastoResponse extends BaseResponse {
  expenses?: Expense[];
  total?: number;
  count?: number;
  expense?: Expense; // Para operaciones de crear/modificar
}

// Respuesta específica para operaciones de categorías
export interface CategoriaResponse extends BaseResponse {
  categories?: Category[];
  category?: Category; // Para operaciones de crear
  count?: number;
}

// === VALIDADORES DE TIPOS ===

// Función para validar si una acción es válida para gastos
export const isValidGastoAccion = (accion: string): accion is GastoAccion => {
  return GASTO_ACCIONES.includes(accion as GastoAccion);
};

// Función para validar si una acción es válida para categorías
export const isValidCategoriaAccion = (
  accion: string
): accion is CategoriaAccion => {
  return CATEGORIA_ACCIONES.includes(accion as CategoriaAccion);
};

// === CONSTANTES DE VALIDACIÓN ===

// Campos requeridos para crear un gasto
export const CAMPOS_REQUERIDOS_CREAR_GASTO = [
  "titulo",
  "precio",
  "categoria",
] as const;

// Campos requeridos para crear una categoría
export const CAMPOS_REQUERIDOS_CREAR_CATEGORIA = [
  "nombre",
  "color",
  "icono",
] as const;

// Campos requeridos para modificar un gasto
export const CAMPOS_REQUERIDOS_MODIFICAR_GASTO = ["id"] as const;

// Campos requeridos para eliminar gastos
export const CAMPOS_REQUERIDOS_ELIMINAR_GASTO = ["ids"] as const;

// === TIPOS PARA FUNCIONES INDIVIDUALES ===

// Input para guardar gasto individual
export interface GuardarGastoInput {
  titulo: string;
  precio: number;
  divisa?: string;
  categoria: string;
}

// Input para crear categoría individual
export interface CrearCategoriaInput {
  nombre: string;
  color: string;
  icono: string;
}

// Input para modificar gasto individual
export interface ModificarGastoInput {
  id: string;
  titulo?: string;
  precio?: number;
  divisa?: string;
  categoria?: string;
}

// === TIPOS DE RESPUESTA INDIVIDUALES ===

// Respuesta para crear un gasto
export interface CrearGastoResponse extends BaseResponse {
  expense?: Expense;
  categoryIcon?: string;
  categoryColor?: string;
}

// Respuesta para obtener gastos
export interface ObtenerGastosResponse extends BaseResponse {
  expenses?: Expense[];
  total?: number;
  count?: number;
}

// Respuesta para crear categoría
export interface CrearCategoriaResponse extends BaseResponse {
  category?: Category;
}

// Respuesta para obtener categorías
export interface ObtenerCategoriasResponse extends BaseResponse {
  categories?: Category[];
  count?: number;
}

// Respuesta para modificar gasto
export interface ModificarGastoResponse extends BaseResponse {
  expense?: Expense;
  originalExpense?: Expense;
  updatedExpense?: Expense;
}

// Input para eliminar gastos
export interface EliminarGastoInput {
  ids: string[];
}

// Respuesta para eliminar gastos
export interface EliminarGastoResponse extends BaseResponse {
  deletedExpenses?: Expense[];
  count?: number;
}
