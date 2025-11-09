import { memo } from "react";
import { Card, Flex, Text } from "@radix-ui/themes";

/**
 * Empty state component for expense list
 * Displays a centered message when no expenses are found
 */
export const ExpenseListEmpty = memo(function ExpenseListEmpty() {
  return (
    <Card>
      <Flex direction="column" align="center" gap="2" p="6">
        <Text size="4" color="gray">
          No se encontraron gastos
        </Text>
      </Flex>
    </Card>
  );
});
