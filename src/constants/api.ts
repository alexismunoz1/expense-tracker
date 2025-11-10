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
 * MAX_SIZE_BYTES: Maximum uncompressed file size (5MB)
 * COMPRESSION_QUALITY: JPEG compression quality (0.8 = 80%)
 * TARGET_COMPRESSED_SIZE: Target size after compression to stay under Vercel's 4.5MB limit
 */
export const FILE_LIMITS = {
  MAX_SIZE_BYTES: 5 * 1024 * 1024, // 5MB (uncompressed)
  COMPRESSION_QUALITY: 0.8, // 80% quality
  TARGET_COMPRESSED_SIZE: 3 * 1024 * 1024, // 3MB (leaves room for base64 overhead)
} as const;

/**
 * Image display sizes for chat UI
 * PREVIEW_THUMBNAIL_SIZE: Size of image thumbnails in preview before sending (80x80px)
 * MESSAGE_IMAGE_WIDTH: Width of images displayed in chat messages (150px)
 */
export const IMAGE_SIZES = {
  PREVIEW_THUMBNAIL_SIZE: 80, // px
  MESSAGE_IMAGE_WIDTH: 150, // px
} as const;
