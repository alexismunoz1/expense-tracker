import { Dispatch, SetStateAction } from "react";

export interface ImageProcessingState {
  selectedFile: File | null;
  isProcessingImage: boolean;
}

export interface ImageProcessingHandlers {
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  processImage: (file: File) => Promise<void>;
  handleImageSubmit: () => void;
  setSelectedFile: Dispatch<SetStateAction<File | null>>;
  setIsProcessingImage: Dispatch<SetStateAction<boolean>>;
}

// ===== HOOK PERSONALIZADO PARA PROCESAMIENTO DE IMÁGENES =====

export const useImageProcessing = (
  sendMessage: (message: { text: string }) => void
): ImageProcessingState & ImageProcessingHandlers => {
  // Estados comentados - descomentar para habilitar
  /*
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      alert("Por favor selecciona un archivo de imagen válido");
    }
  };

  const processImage = async (file: File) => {
    setIsProcessingImage(true);
    try {
      // Convertir la imagen a base64
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const mimeType = file.type;

      // Crear un mensaje con datos embebidos para que el asistente use la herramienta
      const messageText = `He subido una imagen de un recibo. Por favor analízala y crea un gasto automáticamente.

[IMAGEN_DATA:${base64}:${mimeType}]`;

      sendMessage({ text: messageText });
      setSelectedFile(null);
    } catch (error) {
      console.error("Error processing image:", error);
      sendMessage({
        text: `Error al preparar la imagen: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
      });
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageSubmit = () => {
    if (selectedFile) {
      processImage(selectedFile);
    }
  };

  return {
    selectedFile,
    isProcessingImage,
    handleFileSelect,
    processImage,
    handleImageSubmit,
    setSelectedFile,
    setIsProcessingImage,
  };
  */

  // Versión deshabilitada temporal - reemplazar con código de arriba
  return {
    selectedFile: null,
    isProcessingImage: false,
    handleFileSelect: () => {},
    processImage: async () => {},
    handleImageSubmit: () => {},
    setSelectedFile: () => {},
    setIsProcessingImage: () => {},
  };
};

// ===== COMPONENTES UI PARA IMÁGENES =====

export const ImageInputs = () => {
  // JSX comentado - descomentar para habilitar
  /*
  return (
    <>
      <input
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id='image-camera-quick'
      />
      <input
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id='image-upload-quick'
      />
    </>
  );
  */
  return null;
};

export const QuickActionImageButtons = () => {
  // JSX comentado - descomentar para habilitar
  /*
  return (
    <>
      <label htmlFor='image-camera-quick' className={styles.quickActionButton}>
        <span>📸</span> Tomar foto
      </label>
      <label htmlFor='image-upload-quick' className={styles.quickActionButton}>
        <span>🖼️</span> Galería
      </label>
    </>
  );
  */
  return null;
};

export const FooterImageButtons = () => {
  // JSX comentado - descomentar para habilitar
  /*
  return (
    <>
      <input
        type='file'
        accept='image/*'
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id='image-upload'
        disabled={status !== "ready" || isProcessingImage}
      />
      <input
        type='file'
        accept='image/*'
        capture='environment'
        onChange={handleFileSelect}
        style={{ display: "none" }}
        id='image-camera'
        disabled={status !== "ready" || isProcessingImage}
      />
      <label
        htmlFor='image-camera'
        className={`${styles.fileButton} ${
          status !== "ready" || isProcessingImage ? styles.fileButtonDisabled : ""
        }`}
        title='Tomar foto con cámara'>
        📸
      </label>
      <label
        htmlFor='image-upload'
        className={`${styles.fileButton} ${
          status !== "ready" || isProcessingImage ? styles.fileButtonDisabled : ""
        }`}
        title='Seleccionar desde galería'>
        🖼️
      </label>
    </>
  );
  */
  return null;
};

export const ImagePreview = () => {
  // JSX comentado - descomentar para habilitar
  /*
  return (
    selectedFile && (
      <div className={styles.imagePreviewContainer}>
        <div className={styles.imagePreview}>
          <Image
            src={URL.createObjectURL(selectedFile)}
            alt='Preview del recibo'
            className={styles.previewImage}
            width={400}
            height={300}
            style={{ objectFit: "contain" }}
            unoptimized
          />
          <div className={styles.imageActions}>
            <button
              onClick={handleImageSubmit}
              disabled={isProcessingImage}
              className={styles.processButton}>
              {isProcessingImage ? <>⏳ Procesando...</> : <>🔍 Analizar Recibo</>}
            </button>
            <button
              onClick={() => setSelectedFile(null)}
              className={styles.cancelButton}
              disabled={isProcessingImage}>
              ❌ Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  );
  */
  return null;
};

// ===== UTILIDADES AUXILIARES =====

/**
 * Valida si un archivo es una imagen válida
 */
export const isValidImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

/**
 * Convierte archivo a base64
 */
export const fileToBase64 = async (file: File): Promise<string> => {
  const bytes = await file.arrayBuffer();
  return Buffer.from(bytes).toString("base64");
};

/**
 * Crea el mensaje para el asistente con datos de imagen embebidos
 */
export const createImageMessage = (base64: string, mimeType: string): string => {
  return `He subido una imagen de un recibo. Por favor analízala y crea un gasto automáticamente.

[IMAGEN_DATA:${base64}:${mimeType}]`;
};

// ===== CONFIGURACIÓN PARA REACTIVAR =====

export const IMAGE_PROCESSING_CONFIG = {
  enabled: false, // Cambiar a true para habilitar
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ["image/jpeg", "image/png", "image/webp"],
  quality: 0.8, // Calidad de compresión si es necesaria
} as const;

// ===== INSTRUCCIONES DE REACTIVACIÓN =====

/*
PASOS PARA REACTIVAR LA FUNCIONALIDAD:

1. En este archivo (imageProcessing.ts):
   - Cambiar IMAGE_PROCESSING_CONFIG.enabled = true
   - Descomentar todo el código en useImageProcessing hook
   - Descomentar los componentes JSX
   - Agregar imports necesarios (useState, etc.)

2. En page.tsx:
   - Importar: import { useImageProcessing, ImagePreview } from "@/utils/imageProcessing"
   - Importar: import Image from "next/image"
   - Reemplazar estados comentados con: const imageState = useImageProcessing(sendMessage)
   - Reemplazar botones deshabilitados con componentes reales
   - Descomentar <ImagePreview />

3. En chat.module.css:
   - Los estilos ya están listos
   - Remover .quickActionButtonDisabled si es necesario

4. En route.ts:
   - La herramienta procesarImagenRecibo ya está implementada
   - Solo verificar que esté funcionando correctamente

5. Testing:
   - Probar con imágenes reales
   - Verificar análisis de IA
   - Ajustar prompts si es necesario
*/
