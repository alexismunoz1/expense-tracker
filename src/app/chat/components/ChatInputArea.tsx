import { memo } from "react";
import { Box, Flex, TextField, IconButton } from "@radix-ui/themes";
import { ImageIcon } from "@radix-ui/react-icons";
import { HiddenFileInputs } from "./HiddenFileInputs";
import { ChatSubmitButton } from "./ChatSubmitButton";
import type { ChatStatus } from "../types";

const CONTAINER_STYLE = {
  background: "var(--gray-2)",
  borderTop: "1px solid var(--gray-6)",
} as const;

const INPUT_STYLE = { flex: 1 } as const;

interface ChatInputAreaProps {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onFilesChange: (files: FileList | null) => void;
  onGalleryClick: () => void;
  status: ChatStatus;
  error: Error | null;
  hasContent: boolean;
  onStop: () => void;
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
  status,
  error,
  hasContent,
  onStop,
}: ChatInputAreaProps) {
  return (
    <Box p="4" style={CONTAINER_STYLE}>
      <form onSubmit={onSubmit}>
        <Flex gap="2" align="center">
          <HiddenFileInputs
            fileInputRef={fileInputRef}
            cameraInputRef={cameraInputRef}
            onFilesChange={onFilesChange}
          />

          <TextField.Root
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Pregunta sobre tus gastos o registra uno nuevo..."
            disabled={status !== "ready"}
            size="3"
            style={INPUT_STYLE}
          />

          <IconButton
            type="button"
            variant="surface"
            size="3"
            onClick={onGalleryClick}
            disabled={status !== "ready"}
            title="Seleccionar de galería"
          >
            <ImageIcon />
          </IconButton>

          <ChatSubmitButton
            status={status}
            error={error}
            hasContent={hasContent}
            onStop={onStop}
          />
        </Flex>
      </form>
    </Box>
  );
});
