import type { ExpenseListData } from "../../types/chat.types";

export interface ExpenseCardProps {
  expense: ExpenseListData["data"]["expenses"][0];
}
