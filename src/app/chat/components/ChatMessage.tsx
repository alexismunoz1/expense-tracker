import { memo } from "react";
import { Flex, Text, Card } from "@radix-ui/themes";
import { MessageText } from "./MessageText";
import { MessageImage } from "./MessageImage";
import { getImageParts } from "../utils";
import type { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

/**
 * Renders a single chat message with text and/or images
 * Styled differently based on message role (user vs assistant)
 * Memoized to prevent unnecessary re-renders
 */
export const ChatMessage = memo(function ChatMessage({
  message,
}: ChatMessageProps) {
  const imageParts = getImageParts(message.parts);

  return (
    <Card
      key={message.id}
      mb="3"
      style={{
        maxWidth: "85%",
        marginLeft: message.role === "user" ? "auto" : "0",
        marginRight: message.role === "user" ? "0" : "auto",
        background:
          message.role === "user" ? "var(--indigo-9)" : "var(--gray-4)",
      }}
    >
      <Flex direction="column" gap="2">
        <Text weight="bold" size="2">
          {message.role === "user" ? "Tú" : "Asistente"}
        </Text>
        <MessageText message={message} />
        {imageParts.map((part, index) => (
          <MessageImage
            key={`${message.id}-${index}`}
            part={part}
            messageId={message.id}
            index={index}
          />
        ))}
      </Flex>
    </Card>
  );
});
