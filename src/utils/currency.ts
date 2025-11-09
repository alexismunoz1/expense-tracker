import type { CurrencyCode } from "@/types/expense";
import { CURRENCY_INFO } from "@/types/expense";

/**
 * Format a number as currency with proper locale formatting
 * @param amount - The amount to format
 * @param currency - The currency code (USD or ARS)
 * @returns Formatted currency string (e.g., "$1,234.56 USD")
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  // Use Spanish (Argentina) locale for ARS, Spanish (Mexico) for USD
  const locale = currency === "ARS" ? "es-AR" : "es-MX";

  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  // Append currency code to disambiguate between USD and ARS (both use $)
  return `${formatted} ${currency}`;
}

/**
 * Format currency for display in tables (shorter format)
 * @param amount - The amount to format
 * @param currency - The currency code
 * @returns Short formatted string (e.g., "$1,234.56 USD")
 */
export function formatCurrencyShort(
  amount: number,
  currency: CurrencyCode
): string {
  const symbol = CURRENCY_INFO[currency].symbol;
  const formattedAmount = amount.toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol}${formattedAmount} ${currency}`;
}

/**
 * Parse currency code from text input
 * Detects mentions of USD, ARS, dollars, pesos, etc.
 * @param text - The text to parse
 * @returns Detected currency code or null if not found
 */
export function parseCurrencyFromText(text: string): CurrencyCode | null {
  const lowerText = text.toLowerCase();

  // Check for explicit USD mentions
  if (
    lowerText.includes("usd") ||
    lowerText.includes("dólar") ||
    lowerText.includes("dolar") ||
    lowerText.includes("dólares") ||
    lowerText.includes("dolares") ||
    lowerText.includes("dollar") ||
    lowerText.includes("dollars") ||
    lowerText.match(/\bUS\$/i)
  ) {
    return "USD";
  }

  // Check for explicit ARS mentions
  if (
    lowerText.includes("ars") ||
    lowerText.includes("peso") ||
    lowerText.includes("pesos") ||
    lowerText.match(/\bpeso argentino/i) ||
    lowerText.match(/\bpesos argentinos/i) ||
    lowerText.match(/\$\s*arg/i)
  ) {
    return "ARS";
  }

  // No explicit currency found
  return null;
}

/**
 * Get currency symbol
 * @param currency - The currency code
 * @returns Currency symbol ($ for both USD and ARS)
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].symbol;
}

/**
 * Get currency name in Spanish
 * @param currency - The currency code
 * @returns Full currency name
 */
export function getCurrencyName(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].name;
}

/**
 * Get currency flag emoji
 * @param currency - The currency code
 * @returns Flag emoji (🇺🇸 or 🇦🇷)
 */
export function getCurrencyFlag(currency: CurrencyCode): string {
  return CURRENCY_INFO[currency].flag;
}

/**
 * Extract amount from text
 * Handles various formats: $123, 123.45, $1,234.56, etc.
 * @param text - The text to extract amount from
 * @returns Extracted amount or null if not found
 */
export function extractAmountFromText(text: string): number | null {
  // Remove currency symbols and text, keep only numbers, dots, and commas
  const cleaned = text.replace(/[^\d.,]/g, "");

  // Try to parse as number
  // Handle both formats: 1,234.56 (US) and 1.234,56 (AR)
  let amount: number | null = null;

  // Check if it's US format (comma as thousands, dot as decimal)
  if (/^\d{1,3}(,\d{3})*(\.\d{2})?$/.test(cleaned)) {
    amount = parseFloat(cleaned.replace(/,/g, ""));
  }
  // Check if it's AR format (dot as thousands, comma as decimal)
  else if (/^\d{1,3}(\.\d{3})*(,\d{2})?$/.test(cleaned)) {
    amount = parseFloat(cleaned.replace(/\./g, "").replace(",", "."));
  }
  // Try simple parse
  else {
    const parsed = parseFloat(cleaned.replace(",", "."));
    if (!isNaN(parsed)) {
      amount = parsed;
    }
  }

  return amount;
}

/**
 * Validate currency code
 * @param code - The code to validate
 * @returns true if valid currency code
 */
export function isValidCurrency(code: string): code is CurrencyCode {
  return code === "USD" || code === "ARS";
}
