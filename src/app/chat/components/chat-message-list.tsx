import { memo, useEffect, useRef } from "react";
import { Flex, Text, Spinner } from "@radix-ui/themes";
import { CHAT_FEEDBACK } from "@/constants";
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
  const lastMessage = messages[lastMessageIndex];

  // Show feedback when submitted OR when streaming but assistant message has no content yet
  const showGeneratingFeedback =
    status === "submitted" ||
    (status === "streaming" &&
      lastMessage?.role === "assistant" &&
      lastMessage?.parts?.length === 0);

  return (
    <Flex direction="column" gap="2">
      {messages.map((message, index) => (
        <ChatMessage
          key={message.id}
          message={message}
          isStreaming={isStreaming && index === lastMessageIndex}
        />
      ))}
      {showGeneratingFeedback && (
        <Flex align="center" gap="2" p="3">
          <Spinner size="2" />
          <Text size="2" color="gray">
            {CHAT_FEEDBACK.GENERATING_RESPONSES}
          </Text>
        </Flex>
      )}
      <div ref={bottomRef} />
    </Flex>
  );
});
