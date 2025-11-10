import { memo, useMemo, useState } from "react";
import { Box } from "@radix-ui/themes";
import { IMAGE_SIZES } from "@/constants/api";
import { ImageModal } from "./image-modal";
import { ImageSkeleton } from "./image-skeleton";
import styles from "./message-image.module.css";
import type { FilePart } from "../types";

interface MessageImageProps {
  part: FilePart;
  messageId: string;
  index: number;
}

/**
 * Renders an image attachment within a message
 * Features: 150px width, loading skeleton, click to expand in modal
 * Uses native img tag to avoid React warnings with large base64 data URLs
 * Memoized to prevent unnecessary re-renders
 */
export const MessageImage = memo(function MessageImage({
  part,
  messageId,
  index,
}: MessageImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Create a stable reference to avoid React warnings with large base64 strings
  const imageKey = useMemo(
    () => `file-${messageId}-${index}`,
    [messageId, index]
  );

  const handleImageClick = () => {
    if (!isLoading && !hasError) {
      setIsModalOpen(true);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error("Error loading image:", part.url?.substring(0, 50));
  };

  return (
    <>
      <Box
        key={imageKey}
        className={styles.container}
        onClick={handleImageClick}
        style={{ cursor: isLoading || hasError ? "default" : "pointer" }}
      >
        {isLoading && (
          <Box className={styles.skeletonWrapper}>
            <ImageSkeleton size="medium" />
          </Box>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={part.url}
          alt={part.filename || "Imagen adjunta"}
          className={styles.image}
          style={{
            width: `${IMAGE_SIZES.MESSAGE_IMAGE_WIDTH}px`,
            display: isLoading ? "none" : "block",
          }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </Box>

      <ImageModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        imageUrl={part.url}
        filename={part.filename}
      />
    </>
  );
});
