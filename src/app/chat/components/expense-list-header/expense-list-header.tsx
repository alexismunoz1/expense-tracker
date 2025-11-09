import { memo } from "react";
import { Badge, Flex, Text } from "@radix-ui/themes";
import type { ExpenseListHeaderProps } from "./expense-list-header.types";

/**
 * Header component for expense list
 * Displays summary information including total count and sum
 */
export const ExpenseListHeader = memo(function ExpenseListHeader({
  count,
  total,
}: ExpenseListHeaderProps) {
  return (
    <Flex
      justify="between"
      align="start"
      gap="3"
      p="3"
      style={{
        background: "var(--gray-3)",
        borderRadius: "var(--radius-3)",
      }}
    >
      <Flex direction="column" align="start" gap="4">
        <Text size="3" weight="bold">
          Lista de Gastos
        </Text>
        <Flex align="center" gap="2">
          <Text size="2" color="gray">
            Total de gastos:
          </Text>
          <Badge size="2" color="blue">
            {count}
          </Badge>
        </Flex>
        {total && (
          <Flex align="center" gap="2">
            <Text size="2" color="gray">
              Suma total:
            </Text>
            <Text
              size="3"
              weight="bold"
              style={{
                color: "var(--accent-9)",
              }}
            >
              {total}
            </Text>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
});
