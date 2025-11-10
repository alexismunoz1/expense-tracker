import { memo, useEffect } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Dialog, IconButton, Flex } from "@radix-ui/themes";
import styles from "./image-modal.module.css";
import type { ImageModalProps } from "../types/chat.types";

/**
 * Full-screen image modal with zoom animation
 * Opens when clicking on chat message images
 */
export const ImageModal = memo<ImageModalProps>(
  ({ open, onOpenChange, imageUrl, filename }) => {
    // Close on Escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
          onOpenChange(false);
        }
      };

      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }, [open, onOpenChange]);

    return (
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Content
          className={styles.content}
          aria-describedby={undefined}
          onInteractOutside={() => onOpenChange(false)}
        >
          <Flex direction="column" gap="4" className={styles.wrapper}>
            {/* Header with close button */}
            <Flex justify="between" align="center" className={styles.header}>
              <Dialog.Title className={styles.title}>
                {filename || "Imagen"}
              </Dialog.Title>
              <Dialog.Close>
                <IconButton
                  variant="ghost"
                  color="gray"
                  size="3"
                  aria-label="Cerrar"
                >
                  <Cross2Icon width="20" height="20" />
                </IconButton>
              </Dialog.Close>
            </Flex>

            {/* Image container with zoom animation */}
            <div className={styles.imageContainer}>
              <img
                src={imageUrl}
                alt={filename || "Imagen expandida"}
                className={styles.image}
                loading="eager"
              />
            </div>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    );
  }
);

ImageModal.displayName = "ImageModal";
