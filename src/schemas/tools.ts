import { z } from "zod";
import { GASTO_ACCIONES, CATEGORIA_ACCIONES } from "@/types/tools";

// === SCHEMAS AGRUPADOS POR FUNCIONALIDAD ===

// 1. GESTIÓN DE GASTOS (Agrupada)
export const gestionarGastoSchema = z.object({
  accion: z.enum(GASTO_ACCIONES).describe("Acción a realizar con los gastos"),
  datos: z
    .object({
      // Para crear/modificar gastos
      id: z
        .string()
        .optional()
        .describe("ID del gasto (requerido para modificar)"),
      titulo: z.string().optional().describe("Título o descripción del gasto"),
      precio: z.number().optional().describe("Precio del gasto en números"),
      divisa: z
        .enum(["USD", "ARS"])
        .optional()
        .describe(
          "Divisa del gasto: USD (dólares) o ARS (pesos argentinos). Si no se especifica, se usa la divisa preferida del usuario."
        ),
      categoria: z.string().optional().describe("ID de la categoría del gasto"),

      // Para filtrar gastos al obtener
      filtros: z
        .object({
          categoria: z.string().optional(),
          fechaDesde: z.string().optional(),
          fechaHasta: z.string().optional(),
        })
        .optional()
        .describe("Filtros para obtener gastos específicos"),
    })
    .describe("Datos para la operación del gasto"),
});

// 2. GESTIÓN DE CATEGORÍAS (Agrupada)
export const gestionarCategoriaSchema = z.object({
  accion: z
    .enum(CATEGORIA_ACCIONES)
    .describe("Acción a realizar con las categorías"),
  datos: z
    .object({
      // Para crear categorías
      nombre: z.string().optional().describe("Nombre de la categoría"),
      color: z.string().optional().describe("Color para la categoría"),
      icono: z
        .string()
        .optional()
        .describe("Emoji que representa la categoría"),
    })
    .optional()
    .describe("Datos para crear una nueva categoría"),
});

// 3. PROCESAMIENTO DE IMÁGENES (Mantener separada por ser IA)
export const procesarImagenReciboSchema = z.object({
  imagenBase64: z
    .string()
    .describe(
      "Imagen del recibo en formato base64 (sin el prefijo data:mimeType;base64,) o data URL completa"
    ),
  mimeType: z
    .string()
    .optional()
    .describe(
      "Tipo MIME de la imagen (ej: image/jpeg). Si se proporciona una data URL completa, este campo es opcional"
    ),
});

// === TIPOS TYPESCRIPT (Agrupados) ===
export type GestionarGastoInput = z.infer<typeof gestionarGastoSchema>;
export type GestionarCategoriaInput = z.infer<typeof gestionarCategoriaSchema>;
export type ProcesarImagenReciboInput = z.infer<
  typeof procesarImagenReciboSchema
>;

// === SCHEMAS INDIVIDUALES (Compatibilidad con tipos tipados) ===

// Schema para guardar gasto individual - usa constantes para validación
export const guardarGastoSchema = z.object({
  titulo: z
    .string()
    .min(1, "El título es requerido")
    .describe("Título o descripción del gasto"),
  precio: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .describe("Precio del gasto en números"),
  divisa: z
    .enum(["USD", "ARS"])
    .optional()
    .describe("Divisa del gasto: USD (dólares) o ARS (pesos argentinos)"),
  categoria: z
    .string()
    .min(1, "La categoría es requerida")
    .describe("ID de la categoría del gasto"),
});

// Schema para obtener gastos - sin parámetros
export const obtenerGastosSchema = z.object({});

// Schema para modificar gasto individual - usa constantes para validación
export const modificarGastoSchema = z.object({
  id: z
    .string()
    .min(1, "El ID es requerido")
    .describe("ID del gasto a modificar"),
  titulo: z.string().optional().describe("Nuevo título del gasto (opcional)"),
  precio: z
    .number()
    .positive("El precio debe ser mayor a 0")
    .optional()
    .describe("Nuevo precio del gasto (opcional)"),
  divisa: z
    .enum(["USD", "ARS"])
    .optional()
    .describe("Nueva divisa del gasto: USD o ARS (opcional)"),
  categoria: z
    .string()
    .optional()
    .describe("Nueva categoría del gasto (opcional)"),
});

// Schema para crear categoría individual - usa constantes para validación
export const crearCategoriaSchema = z.object({
  nombre: z
    .string()
    .min(1, "El nombre es requerido")
    .describe("Nombre de la categoría"),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "El color debe ser un hexadecimal válido")
    .describe("Color para la categoría"),
  icono: z
    .string()
    .min(1, "El icono es requerido")
    .describe("Emoji que representa la categoría"),
});

// Schema para obtener categorías - sin parámetros
export const obtenerCategoriasSchema = z.object({});

// === TIPOS TYPESCRIPT (Individuales) ===
export type GuardarGastoIndividualInput = z.infer<typeof guardarGastoSchema>;
export type ObtenerGastosIndividualInput = z.infer<typeof obtenerGastosSchema>;
export type ModificarGastoIndividualInput = z.infer<
  typeof modificarGastoSchema
>;
export type CrearCategoriaIndividualInput = z.infer<
  typeof crearCategoriaSchema
>;
export type ObtenerCategoriasIndividualInput = z.infer<
  typeof obtenerCategoriasSchema
>;
