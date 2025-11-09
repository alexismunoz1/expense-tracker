"use client";

import { memo, useEffect, useState } from "react";
import { ExitIcon } from "@radix-ui/react-icons";
import { Avatar, DropdownMenu, Flex, Skeleton, Text } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export const AuthButton = memo(function AuthButton() {
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

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/signin");
  };

  if (isLoading) {
    return (
      <Skeleton>
        <Avatar size="1" radius="full" fallback="" />
      </Skeleton>
    );
  }

  if (!user) {
    return null;
  }

  const displayName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const initials = displayName[0]?.toUpperCase() || "U";

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Flex align="center" gap="3" style={{ cursor: "pointer" }}>
          <Avatar
            size="1"
            radius="full"
            src={user.user_metadata?.avatar_url}
            fallback={initials}
            color="indigo"
          />
          <Flex
            direction="column"
            align="start"
            gap="1"
            display={{ initial: "none", sm: "flex" }}
          >
            <Text size="1" weight="medium">
              {displayName}
            </Text>
            <Text size="1" color="gray">
              {user.email}
            </Text>
          </Flex>
        </Flex>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content size="2" sideOffset={8}>
        <DropdownMenu.Item
          color="red"
          onClick={handleSignOut}
          style={{ cursor: "pointer" }}
        >
          <Flex align="center" gap="2">
            <ExitIcon />
            <Text>Cerrar sesión</Text>
          </Flex>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
});
