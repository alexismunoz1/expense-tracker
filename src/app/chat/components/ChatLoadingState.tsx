import { memo } from "react";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import type { ChatStatus } from "../types";

interface ChatLoadingStateProps {
  status: ChatStatus;
}

/**
 * Loading indicator shown during message processing
 * Memoized to prevent unnecessary re-renders
 */
export const ChatLoadingState = memo(function ChatLoadingState({
  status,
}: ChatLoadingStateProps) {
  if (status !== "submitted" && status !== "streaming") {
    return null;
  }

  return (
    <Box p="4">
      <Flex align="center" gap="2">
        <Spinner />
        <Text>Procesando...</Text>
      </Flex>
    </Box>
  );
});
