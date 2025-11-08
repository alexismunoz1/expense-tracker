"use client";

import { useState } from "react";
import { Card, Flex, Text, Badge, Grid, Box, BadgeProps } from "@radix-ui/themes";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { ExpenseListData } from "../types/chat.types";

interface ExpenseListProps {
  data: ExpenseListData["data"];
}

interface ExpenseCardProps {
  expense: ExpenseListData["data"]["expenses"][0];
}

function ExpenseCard({ expense }: ExpenseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Format price with currency
  const formattedPrice = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: expense.currency === "USD" ? "USD" : "ARS",
    minimumFractionDigits: 2,
  }).format(expense.precio);

  // Format date in Spanish
  const formatDate = (isoDate: string) => {
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
  };

  return (
    <Card
      asChild
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          all: "unset",
          width: "100%",
          cursor: "pointer",
        }}
        aria-expanded={isExpanded}
        aria-label={`Gasto: ${expense.titulo}, ${formattedPrice}`}
      >
        <Flex direction="column" gap="3" mx="3" pb="3"
          style={{
            borderBottom: "1px solid var(--border-primary)",
          }}
        >
          {/* Compact View - Always Visible */}
          <Flex justify="between" align="start" gap="3">
            <Flex direction="column" gap="1" style={{ flex: 1 }}>
              <Flex direction="column" align="start" gap="2">
                <Text size="4" weight="bold" style={{ lineHeight: "1.3" }}>
                  {expense.titulo}
                </Text>
                <Badge
                  color={expense.categoriaColor as BadgeProps["color"]}
                  variant="soft"
                  size="2"
                >
                  {expense.categoriaIcono && (
                    <span style={{ marginRight: "4px" }}>
                      {expense.categoriaIcono}
                    </span>
                  )}
                  {expense.categoria}
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
                    {expense.currency}
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

          {/* Expanded View - Conditional */}
          {isExpanded && (
            <Flex
              direction="column"
              gap="2"
              pt="2"
              style={{
                animation: "slideDown 0.2s ease",
              }}
            >
              <Flex justify="between" align="center">
                <Text size="2" color="gray" weight="medium">
                  Fecha
                </Text>
                <Text size="2">{formatDate(expense.fecha)}</Text>
              </Flex>
            </Flex>
          )}
        </Flex>

        <style jsx>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          button:hover {
            box-shadow: var(--shadow-4);
          }

          button:focus-visible {
            outline: 2px solid var(--accent-8);
            outline-offset: 2px;
          }
        `}</style>
      </button>
    </Card >
  );
}

export default function ExpenseList({ data }: ExpenseListProps) {
  const { expenses, total, count } = data;

  if (!expenses || expenses.length === 0) {
    return (
      <Card>
        <Flex direction="column" align="center" gap="2" p="6">
          <Text size="4" color="gray">
            No se encontraron gastos
          </Text>
        </Flex>
      </Card>
    );
  }

  return (
    <Flex direction="column" gap="4" my="4">
      {/* Header with summary */}
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
              <Text size="3" weight="bold" color="green">
                {total}
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>

      {/* Responsive Grid of Expense Cards */}
      <Grid
        columns={{ initial: "1", sm: "2", lg: "3" }}
        gap="3"
        width="100%"
      >
        {expenses.map((expense) => (
          <ExpenseCard key={expense.id} expense={expense} />
        ))}
      </Grid>
    </Flex>
  );
}
