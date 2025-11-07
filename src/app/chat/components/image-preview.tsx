import { memo } from "react";
import { Box, Flex, Text, IconButton, Card } from "@radix-ui/themes";
import { Cross2Icon } from "@radix-ui/react-icons";

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
}

/**
 * Preview component for selected images before sending
 * Shows thumbnails with filenames and a clear button
 * Memoized to prevent unnecessary re-renders
 */
export const ImagePreview = memo(function ImagePreview({
  files,
  onClear,
}: ImagePreviewProps) {
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
          {Array.from(files).map((file, index) => (
            <Card key={`${file.name}-${file.size}-${index}`} style={{ padding: "8px" }}>
              <Flex direction="column" gap="2" align="center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={PREVIEW_STYLE}
                />
                <Text size="1" style={FILENAME_STYLE}>
                  {file.name}
                </Text>
              </Flex>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Box>
  );
});
