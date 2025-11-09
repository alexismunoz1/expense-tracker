// Currency types and constants
export type CurrencyCode = "USD" | "ARS";

export const CURRENCIES = {
  USD: "USD",
  ARS: "ARS",
} as const;

export const CURRENCY_INFO = {
  USD: {
    code: "USD" as CurrencyCode,
    name: "Dólares estadounidenses",
    symbol: "$",
    flag: "🇺🇸",
  },
  ARS: {
    code: "ARS" as CurrencyCode,
    name: "Pesos argentinos",
    symbol: "$",
    flag: "🇦🇷",
  },
} as const;

export interface Expense {
  id: string;
  user_id: string;
  titulo: string;
  precio: number;
  currency: CurrencyCode; // Currency code (USD or ARS)
  fecha: string;
  categoria: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  nombre: string;
  color: string;
  icono: string;
  fechaCreacion: string;
}

export interface UserProfile {
  user_id: string;
  preferred_currency: CurrencyCode;
  created_at: string;
  updated_at: string;
}
