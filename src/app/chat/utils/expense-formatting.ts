import type { CurrencyCode } from "@/types/expense";

/**
 * Format expense price with currency
 * @param precio - The price amount
 * @param currency - The currency code (USD or ARS)
 * @returns Formatted price string
 */
export function formatExpensePrice(
  precio: number,
  currency: CurrencyCode
): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency === "USD" ? "USD" : "ARS",
    minimumFractionDigits: 2,
  }).format(precio);
}

/**
 * Format expense date in Spanish (abbreviated month)
 * @param isoDate - ISO 8601 date string
 * @returns Formatted date (e.g., "15 ene 2025")
 */
export function formatExpenseDate(isoDate: string): string {
  const date = new Date(isoDate);
  const months = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
