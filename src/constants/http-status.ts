/**
 * HTTP status code constants
 * Standard HTTP response codes used across the application
 */

export const HTTP_STATUS = {
  // Success codes
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  // Client error codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,

  // Server error codes
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * HTTP status code type
 */
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS];
