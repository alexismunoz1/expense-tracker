import { memo } from "react";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Badge, Box, Flex, Text } from "@radix-ui/themes";
import { formatExpensePrice } from "../../utils/expense-formatting";
import type { ExpenseCardHeaderProps } from "./expense-card-header.types";
import type { BadgeProps } from "@radix-ui/themes";

/**
 * Compact header view for expense card
 * Always visible - shows title, category, price, and chevron
 */
export const ExpenseCardHeader = memo(function ExpenseCardHeader({
  titulo,
  precio,
  currency,
  categoria,
  categoriaIcono,
  categoriaColor,
  isExpanded,
}: ExpenseCardHeaderProps) {
  const formattedPrice = formatExpensePrice(precio, currency);

  return (
    <Flex justify="between" align="start" gap="3">
      <Flex direction="column" gap="1" style={{ flex: 1 }}>
        <Flex direction="column" align="start" gap="2">
          <Text size="4" weight="bold" style={{ lineHeight: "1.3" }}>
            {titulo}
          </Text>
          <Badge
            color={categoriaColor as BadgeProps["color"]}
            variant="soft"
            size="2"
          >
            {categoriaIcono && (
              <span style={{ marginRight: "4px" }}>{categoriaIcono}</span>
            )}
            {categoria}
          </Badge>
        </Flex>

        <Flex direction="row" justify="between" align="start">
          <Flex align="center" gap="2">
            <Text
              size="6"
              weight="bold"
              style={{
                color: "var(--accent-9)",
              }}
            >
              {formattedPrice}
            </Text>
            <Text size="1" color="gray">
              {currency}
            </Text>
          </Flex>
          <Box
            style={{
              color: "var(--gray-11)",
              transition: "transform 0.2s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <ChevronDownIcon width="20" height="20" />
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
});
