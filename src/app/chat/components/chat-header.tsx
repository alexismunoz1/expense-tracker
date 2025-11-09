import { memo } from "react";
import { Box, Flex } from "@radix-ui/themes";
import { AuthButton } from "@/components/auth-button";

const HEADER_STYLE = {
  background: "transparent",
} as const;

/**
 * Chat page header with authentication button
 * Memoized to prevent unnecessary re-renders
 */
export const ChatHeader = memo(function ChatHeader() {
  return (
    <Box p="3" style={HEADER_STYLE}>
      <Flex justify="between" align="center">
        <AuthButton />
      </Flex>
    </Box>
  );
});
