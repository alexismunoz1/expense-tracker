import type { CurrencyCode } from "@/types/expense";

export interface ExpenseCardHeaderProps {
  titulo: string;
  precio: number;
  currency: CurrencyCode;
  categoria: string;
  categoriaIcono?: string;
  categoriaColor?: string;
  isExpanded: boolean;
}
