import { memo, useEffect, useRef } from "react";
import { Flex } from "@radix-ui/themes";
import { ChatMessage } from "./chat-message";
import type { Message, ChatStatus } from "../types";

interface ChatMessageListProps {
  messages: Message[];
  status: ChatStatus;
}

/**
 * Renders a list of chat messages
 * Memoized to prevent unnecessary re-renders when messages haven't changed
 */
export const ChatMessageList = memo(function ChatMessageList({
  messages,
  status,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages update or status changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  if (messages.length === 0) {
    return null;
  }

  const isStreaming = status === "streaming";
  const lastMessageIndex = messages.length - 1;

  return (
    <Flex direction="column" gap="2">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={isStreaming && index === lastMessageIndex}
        />
      ))}
      <div ref={bottomRef} />
    </Flex>
  );
});
