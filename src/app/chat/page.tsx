"use client";

import { useState, useCallback } from "react";
import { Flex, Box } from "@radix-ui/themes";
import {
  ChatHeader,
  WelcomeScreen,
  ChatMessageList,
  ChatErrorDisplay,
  ImagePreview,
  ChatInputArea,
} from "./components";
import { useFileUpload, useChatMessages } from "./hooks";
import type { SendMessageParams } from "./types";

const CONTAINER_STYLE = {
  height: "100dvh",
  maxWidth: "800px",
  margin: "0 auto",
  position: "relative" as const,
} as const;

const MESSAGES_AREA_STYLE = {
  overflowY: "auto" as const,
  background: "var(--gray-3)",
  minHeight: 0,
  flex: "1 1 0",
};

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChatMessages();
  const { files, fileInputRef, cameraInputRef, clearFiles, handleFileChange } =
    useFileUpload();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (input.trim() || (files && files.length > 0)) {
        sendMessage({ text: input, files });
        setInput("");
        clearFiles();
      }
    },
    [input, files, sendMessage, clearFiles]
  );

  const handleSendMessage = useCallback(
    (params: SendMessageParams) => {
      sendMessage(params);
    },
    [sendMessage]
  );

  const handleCameraClick = useCallback(() => {
    cameraInputRef.current?.click();
  }, [cameraInputRef]);

  const handleGalleryClick = useCallback(() => {
    fileInputRef.current?.click();
  }, [fileInputRef]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without Shift)
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (input.trim() || (files && files.length > 0)) {
          sendMessage({ text: input, files });
          setInput("");
          clearFiles();
        }
      }
      // Allow Shift+Enter for new line (default textarea behavior)
    },
    [input, files, sendMessage, clearFiles]
  );

  const hasContent =
    input.trim().length > 0 || (files !== undefined && files.length > 0);

  return (
    <Flex direction="column" style={CONTAINER_STYLE}>
      <ChatHeader />

      <Box p="4" style={MESSAGES_AREA_STYLE}>
        {messages.length === 0 ? (
          <WelcomeScreen
            onSendMessage={handleSendMessage}
            onCameraClick={handleCameraClick}
            onGalleryClick={handleGalleryClick}
          />
        ) : (
          <ChatMessageList messages={messages} status={status} />
        )}
      </Box>

      <ChatErrorDisplay error={error} />

      {files && <ImagePreview files={files} onClear={clearFiles} />}

      <ChatInputArea
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        fileInputRef={fileInputRef}
        cameraInputRef={cameraInputRef}
        onFilesChange={handleFileChange}
        onGalleryClick={handleGalleryClick}
        onCameraClick={handleCameraClick}
        onKeyDown={handleKeyDown}
        status={status}
        error={error}
        hasContent={hasContent}
        onStop={stop}
      />
    </Flex>
  );
}
