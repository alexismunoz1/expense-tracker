"use client";

import { memo, useEffect, useState } from "react";
import { Button, Flex, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { AuthButton } from "@/components/auth-button";
import { LANDING_HEADER } from "@/constants/landing";
import { ROUTES } from "@/constants/routes";
import { createClient } from "@/lib/supabase/client";
import type { LandingHeaderProps } from "./landing-header.types";
import type { User } from "@supabase/supabase-js";

export const LandingHeader = memo<LandingHeaderProps>(function LandingHeader({
  className,
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginClick = () => {
    router.push(ROUTES.AUTH_SIGNIN);
  };

  const handleChatClick = () => {
    router.push(ROUTES.CHAT);
  };

  return (
    <Flex
      asChild
      justify="between"
      align="center"
      px={{ initial: "4", md: "6" }}
      py="4"
      className={className}
    >
      <header>
        <Text size="5" weight="bold" color="indigo">
          {LANDING_HEADER.APP_NAME}
        </Text>

        <Flex align="center" gap="3">
          {!isLoading && (
            <>
              {user ? (
                <>
                  <Button
                    variant="soft"
                    onClick={handleChatClick}
                    style={{ cursor: "pointer" }}
                  >
                    {LANDING_HEADER.GO_TO_CHAT}
                  </Button>
                  <AuthButton />
                </>
              ) : (
                <Button
                  variant="solid"
                  onClick={handleLoginClick}
                  style={{ cursor: "pointer" }}
                >
                  {LANDING_HEADER.LOGIN_BUTTON}
                </Button>
              )}
            </>
          )}
        </Flex>
      </header>
    </Flex>
  );
});
