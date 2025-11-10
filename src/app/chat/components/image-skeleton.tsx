import { memo } from "react";
import { Box } from "@radix-ui/themes";
import styles from "./image-skeleton.module.css";
import type { ImageSkeletonProps } from "../types/chat.types";

/**
 * Loading skeleton for images with pulsing animation
 * Used in both preview thumbnails and chat messages
 */
export const ImageSkeleton = memo<ImageSkeletonProps>(({ size = "medium" }) => {
  return (
    <Box
      className={styles.skeleton}
      data-size={size}
      aria-label="Cargando imagen"
      role="status"
    >
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </Box>
  );
});

ImageSkeleton.displayName = "ImageSkeleton";
