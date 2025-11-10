import { memo, useEffect, useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Box, Flex, Text, IconButton, Card } from "@radix-ui/themes";
import { ImageSkeleton } from "./image-skeleton";
import type { FileMetadata } from "../types/chat.types";

const CONTAINER_STYLE = {
  background: "var(--gray-2)",
  borderTop: "1px solid var(--gray-6)",
} as const;

const PREVIEW_STYLE = {
  width: "80px",
  height: "80px",
  objectFit: "cover" as const,
  borderRadius: "var(--radius-2)",
};

const FILENAME_STYLE = {
  maxWidth: "80px",
  overflow: "hidden",
  textOverflow: "ellipsis",
} as const;

interface ImagePreviewProps {
  files: FileList;
  onClear: () => void;
  fileMetadata: FileMetadata[];
}

/**
 * Format bytes to human-readable size
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Preview component for selected images before sending
 * Shows thumbnails with filenames, file size, and loading states
 * Memoized to prevent unnecessary re-renders
 */
export const ImagePreview = memo(function ImagePreview({
  files,
  onClear,
  fileMetadata,
}: ImagePreviewProps) {
  const [objectUrls, setObjectUrls] = useState<string[]>([]);

  // Create and cleanup object URLs
  useEffect(() => {
    if (!files || files.length === 0) {
      return;
    }

    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setObjectUrls(urls);

    // Cleanup on unmount
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  if (!files || files.length === 0) {
    return null;
  }

  return (
    <Box p="4" style={CONTAINER_STYLE}>
      <Flex direction="column" gap="3">
        <Flex justify="between" align="center">
          <Text size="2" weight="medium">
            📎 Imágenes adjuntas ({files.length})
          </Text>
          <IconButton size="1" variant="ghost" onClick={onClear}>
            <Cross2Icon />
          </IconButton>
        </Flex>
        <Flex gap="2" wrap="wrap">
          {Array.from(files).map((file, index) => {
            const metadata = fileMetadata[index];
            const isCompressing = metadata?.isCompressing ?? false;
            const fileSize = metadata?.size ?? file.size;

            return (
              <Card
                key={`${file.name}-${file.size}-${index}`}
                style={{ padding: "8px" }}
              >
                <Flex direction="column" gap="2" align="center">
                  {isCompressing ? (
                    <ImageSkeleton size="small" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={objectUrls[index]}
                      alt={file.name}
                      style={PREVIEW_STYLE}
                    />
                  )}
                  <Flex direction="column" gap="1" align="center">
                    <Text size="1" style={FILENAME_STYLE}>
                      {file.name}
                    </Text>
                    <Text size="1" color="gray">
                      {formatFileSize(fileSize)}
                    </Text>
                  </Flex>
                </Flex>
              </Card>
            );
          })}
        </Flex>
      </Flex>
    </Box>
  );
});
