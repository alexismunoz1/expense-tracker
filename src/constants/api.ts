/**
 * API and AI configuration constants
 * AI model settings, tool names, and API configuration
 */

/**
 * AI model configuration
 */
export const AI_CONFIG = {
  MODEL: "grok-3",
  MAX_STEPS: 4,
} as const;

/**
 * AI tool names for function calling
 */
export const AI_TOOLS = {
  GESTIONAR_GASTO: "gestionarGasto",
  GESTIONAR_CATEGORIA: "gestionarCategoria",
  PROCESAR_IMAGEN_RECIBO: "procesarImagenRecibo",
} as const;

/**
 * Default categories for expense classification
 */
export const DEFAULT_CATEGORIES = {
  ALIMENTACION: "alimentacion",
  TRANSPORTE: "transporte",
  ENTRETENIMIENTO: "entretenimiento",
  SALUD: "salud",
  EDUCACION: "educacion",
  SERVICIOS: "servicios",
  OTROS: "otros",
} as const;

/**
 * Default values for expense creation
 */
export const DEFAULTS = {
  CURRENCY: "USD",
  CATEGORY: DEFAULT_CATEGORIES.OTROS,
} as const;

/**
 * OCR processing configuration
 */
export const OCR_CONFIG = {
  LANGUAGES: ["spa", "eng"],
  WORKER_COUNT: 1,
  MIN_CONFIDENCE: 0.75,
  LOW_CONFIDENCE_THRESHOLD: 0.2,
  MIN_DESCRIPTION_LENGTH: 5,
} as const;

/**
 * File upload limits
 */
export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB
  COMPRESSION_QUALITY: 0.8,
} as const;
