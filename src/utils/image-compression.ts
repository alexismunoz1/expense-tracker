import { FILE_LIMITS } from "@/constants/api";

/**
 * Compresses an image file to meet size requirements for upload
 * Uses canvas-based compression with configurable quality
 *
 * @param file - The image file to compress
 * @param maxSizeBytes - Maximum size in bytes (default: from FILE_LIMITS.TARGET_COMPRESSED_SIZE)
 * @param quality - Compression quality 0-1 (default: from FILE_LIMITS.COMPRESSION_QUALITY)
 * @returns Compressed file or original if already under size limit
 */
export async function compressImage(
  file: File,
  maxSizeBytes: number = FILE_LIMITS.TARGET_COMPRESSED_SIZE,
  quality: number = FILE_LIMITS.COMPRESSION_QUALITY
): Promise<File> {
  // If file is already under size limit, return as-is
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Calculate new dimensions if image is very large
        const maxDimension = 2048;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo crear el contexto del canvas"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try compression with initial quality
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Error al comprimir la imagen"));
              return;
            }

            // If still too large, try with lower quality
            if (blob.size > maxSizeBytes && quality > 0.3) {
              compressImage(file, maxSizeBytes, quality - 0.1)
                .then(resolve)
                .catch(reject);
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };

      img.onerror = () => {
        reject(new Error("Error al cargar la imagen"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Error al leer el archivo"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validates and compresses a file for upload
 * Ensures file meets size and type requirements
 *
 * @param file - File to validate and compress
 * @returns Compressed file ready for upload
 * @throws Error if file type is invalid
 */
export async function validateAndCompressFile(file: File): Promise<File> {
  // Check if file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("Solo se permiten archivos de imagen");
  }

  // Check max file size before compression
  if (file.size > FILE_LIMITS.MAX_SIZE_BYTES) {
    throw new Error(
      `La imagen es demasiado grande (${(file.size / 1024 / 1024).toFixed(1)}MB). El tamaño máximo es ${FILE_LIMITS.MAX_SIZE_BYTES / 1024 / 1024}MB`
    );
  }

  // Compress if needed
  return compressImage(file);
}
