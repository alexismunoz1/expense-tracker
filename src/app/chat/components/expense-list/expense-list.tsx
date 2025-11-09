import { memo } from "react";
import { Flex, Grid } from "@radix-ui/themes";
import { ExpenseCard } from "../expense-card";
import { ExpenseListEmpty } from "../expense-list-empty";
import { ExpenseListHeader } from "../expense-list-header";
import type { ExpenseListProps } from "./expense-list.types";

/**
 * Main expense list component
 * Displays a grid of expense cards with summary header
 */
export const ExpenseList = memo(function ExpenseList({
  data,
}: ExpenseListProps) {
  const { expenses, total, count } = data;

  console.log(data);

  if (!expenses || expenses.length === 0) {
    return <ExpenseListEmpty />;
  }

  return (
    <Flex
      direction="column"
      gap="4"
      my="4"
      style={{
        borderRadius: "var(--radius-3)",
        backgroundColor: "var(--bg-secondary)",
        paddingBottom: "var(--space-3)",
      }}
    >
      {/* Header with summary */}
      <ExpenseListHeader count={count} total={total} />

      {/* Responsive Grid of Expense Cards */}
      <Grid columns={{ initial: "1", sm: "2", lg: "3" }} gap="3" width="100%">
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </Grid>
    </Flex>
  );
});
