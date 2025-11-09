import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { Message, ChatStatus, SendMessageParams } from "../types";

export interface UseChatMessagesReturn {
  messages: Message[];
  sendMessage: (params: SendMessageParams) => void;
  status: ChatStatus;
  error: Error | null;
  stop: () => void;
}

/**
 * Custom hook that wraps the AI SDK's useChat hook with type-safe interfaces
 * Provides a clean abstraction over the chat functionality
 */
export function useChatMessages(): UseChatMessagesReturn {
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return {
    messages: messages as Message[],
    sendMessage: (params: SendMessageParams) => {
      sendMessage({
        text:
          params.text || "Analiza esta imagen y crea un gasto automáticamente",
        files: params.files,
      });
    },
    status: status as ChatStatus,
    error: error || null,
    stop,
  };
}
