import { memo } from "react";
import { Box } from "@radix-ui/themes";
import { ChatMessage } from "./chat-message";
import type { Message } from "../types";

interface ChatMessageListProps {
  messages: Message[];
}

/**
 * Renders a list of chat messages
 * Memoized to prevent unnecessary re-renders when messages haven't changed
 */
export const ChatMessageList = memo(function ChatMessageList({
  messages,
}: ChatMessageListProps) {
  if (messages.length === 0) {
    return null;
  }

  return (
    <Box>
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </Box>
  );
});
