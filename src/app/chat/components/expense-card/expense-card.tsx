"use client";

import { memo, useState } from "react";
import { Card, Flex } from "@radix-ui/themes";
import { ExpenseCardDetails } from "../expense-card-details";
import { ExpenseCardHeader } from "../expense-card-header";
import styles from "./expense-card.module.css";
import type { ExpenseCardProps } from "./expense-card.types";

/**
 * Expense card container component
 * Manages expand/collapse state and composes header + details
 */
export const ExpenseCard = memo(function ExpenseCard({
  expense,
}: ExpenseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: expense.currency === "USD" ? "USD" : "ARS",
    minimumFractionDigits: 2,
  }).format(expense.precio);

  return (
    <Card asChild className={styles.card}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={styles.button}
        aria-expanded={isExpanded}
        aria-label={`Gasto: ${expense.titulo}, ${formattedPrice}`}
      >
        <Flex
          direction="column"
          gap="3"
          mx="3"
          pb="3"
          className={styles.content}
        >
          {/* Compact View - Always Visible */}
          <ExpenseCardHeader
            titulo={expense.titulo}
            precio={expense.precio}
            currency={expense.currency}
            categoria={expense.categoria}
            categoriaIcono={expense.categoriaIcono}
            categoriaColor={expense.categoriaColor}
            isExpanded={isExpanded}
          />

          {/* Expanded View - Conditional */}
          {isExpanded && <ExpenseCardDetails fecha={expense.fecha} />}
        </Flex>
      </button>
    </Card>
  );
});
