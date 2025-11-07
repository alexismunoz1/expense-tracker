import { memo } from "react";
import { Button } from "@radix-ui/themes";
import { ArrowUpIcon, StopIcon } from "@radix-ui/react-icons";
import type { ChatStatus } from "../types";

const BUTTON_STYLE = { padding: "0.75rem" } as const;

interface ChatSubmitButtonProps {
  status: ChatStatus;
  error: Error | null;
  hasContent: boolean;
  onStop: () => void;
}

/**
 * Dynamic submit button that changes between submit and stop based on chat status
 * Memoized to prevent unnecessary re-renders
 */
export const ChatSubmitButton = memo(function ChatSubmitButton({
  status,
  error,
  hasContent,
  onStop,
}: ChatSubmitButtonProps) {
  // Show stop button when processing
  if (status === "submitted" || status === "streaming") {
    return (
      <Button
        type="button"
        color="red"
        size="3"
        style={BUTTON_STYLE}
        onClick={onStop}
      >
        <StopIcon />
      </Button>
    );
  }

  // Show submit button when ready
  return (
    <Button
      type="submit"
      size="3"
      style={BUTTON_STYLE}
      disabled={status !== "ready" || !!error || !hasContent}
    >
      <ArrowUpIcon />
    </Button>
  );
});
