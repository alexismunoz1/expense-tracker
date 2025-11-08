import { memo } from "react";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import type { ChatStatus } from "../types";

interface ChatLoadingStateProps {
  status: ChatStatus;
}

/**
 * Loading indicator shown during message processing
 * Includes ARIA live region for screen reader announcements
 * Memoized to prevent unnecessary re-renders
 */
export const ChatLoadingState = memo(function ChatLoadingState({
  status,
}: ChatLoadingStateProps) {
  if (status !== "submitted" && status !== "streaming") {
    return null;
  }

  const statusText =
    status === "submitted" ? "Enviando mensaje..." : "Generando respuesta...";

  return (
    <Box p="4" role="status" aria-live="polite" aria-atomic="true">
      <Flex align="center" gap="2">
        <Spinner />
        <Text>{statusText}</Text>
      </Flex>
    </Box>
  );
});
