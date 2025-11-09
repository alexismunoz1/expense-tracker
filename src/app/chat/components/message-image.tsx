import { memo, useMemo } from "react";
import { Box } from "@radix-ui/themes";
import type { FilePart } from "../types";

interface MessageImageProps {
  part: FilePart;
  messageId: string;
  index: number;
}

/**
 * Renders an image attachment within a message
 * Uses native img tag to avoid React warnings with large base64 data URLs
 * Memoized to prevent unnecessary re-renders
 */
export const MessageImage = memo(function MessageImage({
  part,
  messageId,
  index,
}: MessageImageProps) {
  // Create a stable reference to avoid React warnings with large base64 strings
  const imageKey = useMemo(
    () => `file-${messageId}-${index}`,
    [messageId, index]
  );

  return (
    <Box key={imageKey}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={part.url}
        alt={part.filename || "Imagen adjunta"}
        style={{
          borderRadius: "var(--radius-3)",
          maxWidth: "100%",
          height: "auto",
          width: "400px",
        }}
        loading="lazy"
      />
    </Box>
  );
});
