/**
 * Database and Supabase error codes
 * PostgreSQL and Supabase-specific error codes
 */

/**
 * Supabase PostgREST error codes
 */
export const SUPABASE_ERRORS = {
  NO_ROWS: "PGRST116", // No rows returned (404-like error)
} as const;

/**
 * Database error types
 */
export type SupabaseError =
  (typeof SUPABASE_ERRORS)[keyof typeof SUPABASE_ERRORS];
