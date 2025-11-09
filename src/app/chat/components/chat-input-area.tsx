import { memo, useRef, useEffect } from "react";
import { Box, Flex, TextArea } from "@radix-ui/themes";
import { ChatSubmitButton } from "./chat-submit-button";
import { FileUploadDialog } from "./file-upload-dialog";
import { HiddenFileInputs } from "./hidden-file-inputs";
import type { ChatStatus } from "../types";

const CONTAINER_STYLE = {
  background: "var(--gray-2)",
  borderTop: "1px solid var(--gray-6)",
  position: "sticky" as const,
  bottom: 0,
  zIndex: 10,
} as const;

const INPUT_STYLE = { flex: 1, width: "100%" } as const;

const TEXTAREA_STYLE = {
  width: "100%",
  minHeight: "40px",
  maxHeight: "200px",
  overflow: "hidden",
  resize: "none",
} as const;

interface ChatInputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onFilesChange: (files: FileList | null) => void;
  onGalleryClick: () => void;
  onCameraClick: () => void;
  status: ChatStatus;
  error: Error | null;
  hasContent: boolean;
  onStop: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

/**
 * Complete input area with text field, file buttons, and submit button
 * Handles user input and file attachments
 * Memoized to prevent unnecessary re-renders
 */
export const ChatInputArea = memo(function ChatInputArea({
  input,
  onInputChange,
  onSubmit,
  fileInputRef,
  cameraInputRef,
  onFilesChange,
  onGalleryClick,
  onCameraClick,
  status,
  error,
  hasContent,
  onStop,
  onKeyDown,
}: ChatInputAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  return (
    <Box p="3" style={CONTAINER_STYLE}>
      <form onSubmit={onSubmit}>
        <Flex direction="column" gap="2">
          <Flex gap="2" align="center">
            <Box style={INPUT_STYLE}>
              <TextArea
                ref={textareaRef}
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Pregunta sobre tus gastos o registra uno nuevo..."
                disabled={status !== "ready"}
                size="2"
                resize="vertical"
                aria-label="Campo de mensaje"
                aria-describedby="keyboard-hint"
                style={TEXTAREA_STYLE}
              />
            </Box>
          </Flex>

          <Flex justify="between" align="center">
            <HiddenFileInputs
              fileInputRef={fileInputRef}
              cameraInputRef={cameraInputRef}
              onFilesChange={onFilesChange}
            />

            <FileUploadDialog
              onGalleryClick={onGalleryClick}
              onCameraClick={onCameraClick}
              disabled={status !== "ready"}
            />
            <ChatSubmitButton
              status={status}
              error={error}
              hasContent={hasContent}
              onStop={onStop}
            />
          </Flex>
        </Flex>
      </form>
    </Box>
  );
});
