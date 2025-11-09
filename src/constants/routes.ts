/**
 * Application route constants
 * Centralized route paths to avoid hardcoded strings
 */

export const ROUTES = {
  // Public routes
  HOME: "/",
  AUTH_SIGNIN: "/auth/signin",
  AUTH_CALLBACK: "/auth/callback",

  // Protected routes
  CHAT: "/chat",
  ONBOARDING: "/onboarding",

  // API routes
  API_CHAT: "/api/chat",
  API_ONBOARDING: "/api/onboarding",
  API_AUTH: "/api/auth",

  // Next.js internal routes (for middleware exclusions)
  NEXT_INTERNAL: "/_next",
} as const;

/**
 * Route prefixes for pattern matching in middleware
 */
export const ROUTE_PREFIXES = {
  AUTH: "/auth",
  API: "/api",
  NEXT: "/_next",
} as const;

/**
 * Route groups for access control
 */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.AUTH_SIGNIN,
  ROUTES.AUTH_CALLBACK,
] as const;

export const PROTECTED_ROUTES = [ROUTES.CHAT, ROUTES.ONBOARDING] as const;
