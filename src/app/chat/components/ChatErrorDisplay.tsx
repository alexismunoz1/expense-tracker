import { memo } from "react";
import { Box, Callout } from "@radix-ui/themes";

interface ChatErrorDisplayProps {
  error: Error | null;
}

/**
 * Displays chat errors in a red callout box
 * Memoized to prevent unnecessary re-renders
 */
export const ChatErrorDisplay = memo(function ChatErrorDisplay({
  error,
}: ChatErrorDisplayProps) {
  if (!error) {
    return null;
  }

  return (
    <Box p="4">
      <Callout.Root color="red">
        <Callout.Text>❌ Ocurrió un error: {error.message}</Callout.Text>
      </Callout.Root>
    </Box>
  );
});
