import { memo } from "react";
import { Box, Flex, Text } from "@radix-ui/themes";
import { AuthButton } from "@/components/auth-button";
import { LANDING_HEADER } from "@/constants/landing";

const HEADER_STYLE = {
  background: "transparent",
  borderBottom: "1px solid var(--gray-6)",
} as const;

/**
 * Chat page header with logo and authentication button
 * Memoized to prevent unnecessary re-renders
 */
export const ChatHeader = memo(function ChatHeader() {
  return (
    <Box p="3" style={HEADER_STYLE}>
      <Flex justify="between" align="center">
        <Text size="5" weight="bold" color="indigo">
          {LANDING_HEADER.APP_NAME}
        </Text>
        <AuthButton />
      </Flex>
    </Box>
  );
});
