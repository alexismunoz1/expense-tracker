import { useState, useRef, useCallback } from "react";
import { validateAndCompressFile } from "@/utils/image-compression";
import type { FileMetadata } from "../types/chat.types";

export interface UseFileUploadReturn {
  files: FileList | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  setFiles: (files: FileList | undefined) => void;
  clearFiles: () => void;
  handleFileChange: (files: FileList | null) => Promise<void>;
  isCompressing: boolean;
  compressionError: string | null;
  fileMetadata: FileMetadata[];
}

/**
 * Custom hook for managing file uploads (camera and gallery)
 * Handles file state, refs, cleanup, and automatic compression
 */
export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionError, setCompressionError] = useState<string | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileMetadata[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const clearFiles = useCallback(() => {
    setFiles(undefined);
    setCompressionError(null);
    setFileMetadata([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  }, []);

  const handleFileChange = useCallback(async (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) {
      return;
    }

    setIsCompressing(true);
    setCompressionError(null);

    // Initialize metadata with compressing state
    const initialMetadata: FileMetadata[] = Array.from(newFiles).map(
      (file) => ({
        file,
        size: file.size,
        isCompressing: true,
      })
    );
    setFileMetadata(initialMetadata);

    try {
      // Compress all files and collect metadata
      const compressedFilesWithMetadata = await Promise.all(
        Array.from(newFiles).map(async (file) => {
          const compressedFile = await validateAndCompressFile(file);
          return {
            file: compressedFile,
            size: compressedFile.size,
            isCompressing: false,
          };
        })
      );

      // Convert back to FileList-like object
      const dataTransfer = new DataTransfer();
      compressedFilesWithMetadata.forEach(({ file }) =>
        dataTransfer.items.add(file)
      );

      setFiles(dataTransfer.files);
      setFileMetadata(compressedFilesWithMetadata);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al procesar la imagen";
      setCompressionError(errorMessage);
      setFileMetadata([]);
      console.error("Error compressing files:", error);
    } finally {
      setIsCompressing(false);
    }
  }, []);

  return {
    files,
    fileInputRef,
    cameraInputRef,
    setFiles,
    clearFiles,
    handleFileChange,
    isCompressing,
    compressionError,
    fileMetadata,
  };
}
