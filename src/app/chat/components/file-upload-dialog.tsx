import { memo, useState } from "react";
import {
  ImageIcon,
  CameraIcon,
  PlusIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import { Dialog, Button, Flex, Text, IconButton, Box } from "@radix-ui/themes";

interface FileUploadDialogProps {
  onGalleryClick: () => void;
  onCameraClick: () => void;
  disabled?: boolean;
}

/**
 * Drawer-style modal dialog for selecting file upload source (gallery or camera)
 * Slides up from bottom, automatically closes after selection
 * Accessible with keyboard navigation and ARIA labels
 */
export const FileUploadDialog = memo(function FileUploadDialog({
  onGalleryClick,
  onCameraClick,
  disabled = false,
}: FileUploadDialogProps) {
  const [open, setOpen] = useState(false);

  const handleGalleryClick = () => {
    onGalleryClick();
    setOpen(false);
  };

  const handleCameraClick = () => {
    onCameraClick();
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <Button
          type="button"
          variant="surface"
          size="2"
          disabled={disabled}
          aria-label="Adjuntar archivo"
          title="Adjuntar archivo"
        >
          <PlusIcon />
        </Button>
      </Dialog.Trigger>

      <Dialog.Content
        onKeyDown={handleKeyDown}
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          maxWidth: "100%",
          margin: 0,
          borderRadius: "16px 16px 0 0",
          padding: "1.5rem",
          animation: open
            ? "slideUpAndFade 300ms cubic-bezier(0.16, 1, 0.3, 1)"
            : "slideDownAndFade 300ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <IconButton
          variant="ghost"
          color="gray"
          size="2"
          onClick={() => setOpen(false)}
          aria-label="Cerrar"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            cursor: "pointer",
          }}
        >
          <Cross2Icon width="20" height="20" />
        </IconButton>

        <Dialog.Title size="5" mb="2" style={{ textAlign: "start" }}>
          Adjuntar archivo
        </Dialog.Title>
        <Dialog.Description
          size="2"
          mb="4"
          style={{ textAlign: "start", color: "var(--gray-11)" }}
        >
          Selecciona una opción para adjuntar una imagen
        </Dialog.Description>

        <Flex direction="row" gap="3" justify="center">
          <Box
            onClick={handleGalleryClick}
            role="button"
            tabIndex={0}
            aria-label="Seleccionar imagen de galería"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleGalleryClick();
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "2rem 2.5rem",
              borderRadius: "12px",
              backgroundColor: "var(--accent-3)",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-3)";
            }}
          >
            <ImageIcon width="32" height="32" />
            <Text size="3" weight="medium" align="center">
              Imagen
            </Text>
          </Box>

          <Box
            onClick={handleCameraClick}
            role="button"
            tabIndex={0}
            aria-label="Tomar foto con cámara"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCameraClick();
              }
            }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "2rem 2.5rem",
              borderRadius: "12px",
              backgroundColor: "var(--accent-3)",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent-3)";
            }}
          >
            <CameraIcon width="32" height="32" />
            <Text size="3" weight="medium" align="center">
              Cámara
            </Text>
          </Box>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
});
