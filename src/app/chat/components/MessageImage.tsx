import { memo } from "react";
import Image from "next/image";
import { Box } from "@radix-ui/themes";
import type { FilePart } from "../types";

interface MessageImageProps {
  part: FilePart;
  messageId: string;
  index: number;
}

/**
 * Renders an image attachment within a message
 * Memoized to prevent unnecessary re-renders
 */
export const MessageImage = memo(function MessageImage({
  part,
  messageId,
  index,
}: MessageImageProps) {
  return (
    <Box key={`file-${messageId}-${index}`}>
      <Image
        src={part.url}
        alt={part.filename || "Imagen adjunta"}
        width={400}
        height={300}
        style={{ borderRadius: "var(--radius-3)", maxWidth: "100%" }}
        unoptimized
      />
    </Box>
  );
});
