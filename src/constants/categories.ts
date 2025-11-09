/**
 * Category detection keywords and patterns
 * Keywords used for automatic expense categorization
 */

/**
 * Food and dining related keywords
 */
export const FOOD_KEYWORDS = [
  "restaurante",
  "restaurant",
  "comida",
  "café",
  "cafe",
  "bar",
  "pizza",
  "hamburguesa",
  "supermercado",
  "market",
  "tienda",
  "food",
  "cocina",
  "panaderia",
  "bakery",
  "carniceria",
  "verduleria",
] as const;

/**
 * Transport related keywords
 */
export const TRANSPORT_KEYWORDS = [
  "gasolina",
  "gas",
  "uber",
  "taxi",
  "metro",
  "bus",
  "autobus",
  "transporte",
  "parking",
  "estacionamiento",
  "peaje",
  "combustible",
  "cabify",
  "subte",
] as const;

/**
 * Entertainment related keywords
 */
export const ENTERTAINMENT_KEYWORDS = [
  "cine",
  "cinema",
  "teatro",
  "concierto",
  "museo",
  "parque",
  "juego",
  "game",
  "entretenimiento",
  "diversión",
  "diversion",
] as const;

/**
 * Health related keywords
 */
export const HEALTH_KEYWORDS = [
  "farmacia",
  "pharmacy",
  "hospital",
  "médico",
  "medico",
  "doctor",
  "clinica",
  "salud",
  "health",
  "medicina",
  "consulta",
] as const;

/**
 * Education related keywords
 */
export const EDUCATION_KEYWORDS = [
  "escuela",
  "school",
  "universidad",
  "curso",
  "course",
  "libro",
  "book",
  "educación",
  "educacion",
  "education",
  "academia",
] as const;

/**
 * Services related keywords
 */
export const SERVICES_KEYWORDS = [
  "luz",
  "agua",
  "internet",
  "teléfono",
  "telefono",
  "phone",
  "electricidad",
  "cable",
  "servicio",
  "service",
  "gas",
] as const;

/**
 * Category keyword mapping
 */
export const CATEGORY_KEYWORDS = {
  alimentacion: FOOD_KEYWORDS,
  transporte: TRANSPORT_KEYWORDS,
  entretenimiento: ENTERTAINMENT_KEYWORDS,
  salud: HEALTH_KEYWORDS,
  educacion: EDUCATION_KEYWORDS,
  servicios: SERVICES_KEYWORDS,
} as const;
