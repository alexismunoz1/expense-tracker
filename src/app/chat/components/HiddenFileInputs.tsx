import { memo } from "react";

interface HiddenFileInputsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  cameraInputRef: React.RefObject<HTMLInputElement | null>;
  onFilesChange: (files: FileList | null) => void;
}

/**
 * Hidden file input elements for camera and gallery
 * Triggered by IconButtons in the main UI
 */
export const HiddenFileInputs = memo(function HiddenFileInputs({
  fileInputRef,
  cameraInputRef,
  onFilesChange,
}: HiddenFileInputsProps) {
  return (
    <>
      {/* Camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => onFilesChange(e.target.files)}
      />

      {/* Gallery input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => onFilesChange(e.target.files)}
      />
    </>
  );
});
