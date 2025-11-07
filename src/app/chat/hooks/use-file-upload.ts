import { useState, useRef, useCallback } from "react";

export interface UseFileUploadReturn {
  files: FileList | undefined;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  setFiles: (files: FileList | undefined) => void;
  clearFiles: () => void;
  handleFileChange: (files: FileList | null) => void;
}

/**
 * Custom hook for managing file uploads (camera and gallery)
 * Handles file state, refs, and cleanup
 */
export function useFileUpload(): UseFileUploadReturn {
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const clearFiles = useCallback(() => {
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  }, []);

  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (newFiles && newFiles.length > 0) {
      setFiles(newFiles);
    }
  }, []);

  return {
    files,
    fileInputRef,
    cameraInputRef,
    setFiles,
    clearFiles,
    handleFileChange,
  };
}
