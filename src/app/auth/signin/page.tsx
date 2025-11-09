"use client";

import { useState, Suspense } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import {
  Flex,
  Card,
  Heading,
  Text,
  Button,
  Callout,
  Container,
  Spinner,
} from "@radix-ui/themes";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SignInForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/chat";
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
            redirectTo
          )}`,
        },
      });

      if (error) {
        setError(error.message);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
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
                Expense Tracker
              </Heading>
              <Text align="center" color="gray" size="3">
                Gestiona tus gastos con inteligencia artificial
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

            <Button
              size="3"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              style={{ cursor: "pointer" }}
            >
              {isLoading ? (
                <Flex align="center" gap="2">
                  <Spinner />
                  <Text>Iniciando sesión...</Text>
                </Flex>
              ) : (
                <Flex align="center" gap="2">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <Text>Continuar con Google</Text>
                </Flex>
              )}
            </Button>

            <Text align="center" size="2" color="gray">
              Al continuar, aceptas nuestros términos de servicio y política de
              privacidad.
            </Text>
          </Flex>
        </Card>
      </Container>
    </Flex>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <Flex
          minHeight="100vh"
          align="center"
          justify="center"
          style={{ background: "var(--gray-2)" }}
        >
          <Flex align="center" gap="2">
            <Spinner size="3" />
            <Text color="gray">Cargando...</Text>
          </Flex>
        </Flex>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
