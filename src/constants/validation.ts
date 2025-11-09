/**
 * Validation rules and thresholds
 * Magic numbers for validation, limits, and business rules
 */

/**
 * Expense validation rules
 */
export const EXPENSE_VALIDATION = {
  MAX_AMOUNT: 1000000,
  MIN_DESCRIPTION_LENGTH: 5,
  MAX_TEXT_PREVIEW: 200,
} as const;

/**
 * OCR confidence thresholds
 */
export const OCR_THRESHOLDS = {
  MIN_CONFIDENCE: 0.75,
  LOW_CONFIDENCE: 0.2,
} as const;

/**
 * File upload validation
 */
export const FILE_VALIDATION = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  COMPRESSION_QUALITY: 0.8,
} as const;
