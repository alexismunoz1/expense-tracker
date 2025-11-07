"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CurrencyCode, CURRENCY_INFO } from "@/types/expense";
import {
  Flex,
  Card,
  Heading,
  Text,
  Button,
  Callout,
  Container,
  Spinner,
  Select,
} from "@radix-ui/themes";
import { InfoCircledIcon } from "@radix-ui/react-icons";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>("USD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value as CurrencyCode);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Call onboarding API
      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currency: selectedCurrency,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al completar la configuración");
        setIsLoading(false);
        return;
      }

      // Redirect to chat
      router.push("/chat");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al completar la configuración"
      );
      setIsLoading(false);
    }
  };

  return (
    <Flex
      minHeight="100vh"
      align="center"
      justify="center"
      p="4"
      style={{
        background: "var(--gray-2)",
      }}
    >
      <Container size="1">
        <Card size="4" style={{ maxWidth: "400px", width: "100%" }}>
          <Flex direction="column" gap="6">
            <Flex direction="column" align="center" gap="2">
              <Heading size="8" align="center">
                Configuración inicial
              </Heading>
              <Text align="center" color="gray" size="3">
                Personaliza tu experiencia de seguimiento de gastos
              </Text>
            </Flex>

            {error && (
              <Callout.Root color="red" variant="surface">
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            <Flex direction="column" gap="3">
              <Flex direction="column" gap="2">
                <Text size="3" weight="medium">
                  ¿Qué divisa utilizas principalmente?
                </Text>
                <Text size="2" color="gray">
                  Podrás especificar otras divisas al crear gastos si lo necesitas
                </Text>
              </Flex>

              <Select.Root
                value={selectedCurrency}
                onValueChange={handleCurrencyChange}
                disabled={isLoading}
              >
                <Select.Trigger
                  variant="surface"
                  style={{
                    width: "100%",
                    cursor: "pointer",
                    fontSize: "var(--font-size-3)",
                  }}
                />
                <Select.Content>
                  <Select.Group>
                    {Object.entries(CURRENCY_INFO).map(([code, info]) => (
                      <Select.Item key={code} value={code}>
                        <Flex align="center" gap="2">
                          <Text>{info.flag}</Text>
                          <Text>{info.name}</Text>
                          <Text color="gray">({code})</Text>
                        </Flex>
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </Flex>

            <Button
              size="3"
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ cursor: "pointer" }}
            >
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Spinner />
                  <Text>Guardando configuración...</Text>
                </Flex>
              ) : (
                "Continuar"
              )}
            </Button>

            <Callout.Root variant="surface">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>
                Esta configuración se usará por defecto en tus gastos. Podrás
                cambiarla más adelante si lo deseas.
              </Callout.Text>
            </Callout.Root>
          </Flex>
        </Card>
      </Container>
    </Flex>
  );
}
