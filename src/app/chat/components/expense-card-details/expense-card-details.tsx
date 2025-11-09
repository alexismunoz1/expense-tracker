import { memo } from "react";
import { Flex, Text } from "@radix-ui/themes";
import { formatExpenseDate } from "../../utils/expense-formatting";
import styles from "./expense-card-details.module.css";
import type { ExpenseCardDetailsProps } from "./expense-card-details.types";

/**
 * Expanded details section for expense card
 * Displays additional information when card is expanded
 */
export const ExpenseCardDetails = memo(function ExpenseCardDetails({
  fecha,
}: ExpenseCardDetailsProps) {
  return (
    <Flex direction="column" gap="2" pt="2" className={styles.container}>
      <Flex justify="between" align="center">
        <Text size="2" color="gray" weight="medium">
          Fecha
        </Text>
        <Text size="2">{formatExpenseDate(fecha)}</Text>
      </Flex>
    </Flex>
  );
});
