import { memo, useMemo } from "react";
import { Flex } from "@radix-ui/themes";
import { getImageParts, hasInternalLoadingIndicator } from "../utils";
import styles from "./chat-message.module.css";
import { InlineLoadingIndicator } from "./inline-loading-indicator";
import { MessageImage } from "./message-image";
import { MessageText } from "./message-text";
import type { Message } from "../types";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
}

/**
 * Renders a single chat message with text and/or images
 * Styled differently based on message role (user vs assistant)
 * Memoized to prevent unnecessary re-renders with custom comparison
 */
export const ChatMessage = memo(function ChatMessage({
  message,
  isStreaming = false,
}: ChatMessageProps) {
  const imageParts = useMemo(
    () => getImageParts(message.parts),
    [message.parts]
  );

  // Check if message already has an internal loading indicator
  const hasInternalLoading = useMemo(
    () => hasInternalLoadingIndicator(message),
    [message]
  );

  // Only show inline loading indicator if:
  // 1. Message is streaming
  // 2. Message is from assistant
  // 3. Message doesn't already have an internal loading indicator
  const shouldShowLoadingIndicator =
    isStreaming && message.role === "assistant" && !hasInternalLoading;

  return (
    <div className={styles.messageContainer} data-role={message.role}>
      <div
        className={
          message.role === "user" ? styles.userMessage : styles.assistantMessage
        }
      >
        <Flex className={styles.messageContent}>
          <MessageText message={message} />
          {imageParts.map((part, index) => (
            <MessageImage
              key={`${message.id}-${index}`}
              part={part}
              messageId={message.id}
              index={index}
            />
          ))}
          {shouldShowLoadingIndicator && (
            <div className={styles.loadingIndicator}>
              <InlineLoadingIndicator />
            </div>
          )}
        </Flex>
      </div>
    </div>
  );
});
