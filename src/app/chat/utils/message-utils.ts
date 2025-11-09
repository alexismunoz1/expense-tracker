import type { MessagePart, TextPart, FilePart, Message } from "../types";

/**
 * Checks if a text string is a base64 data URL (should not be rendered as text)
 */
function isBase64DataUrl(text: string | undefined): boolean {
  if (!text) return false;
  return text.startsWith("data:image/") && text.includes("base64,");
}

/**
 * Filters and returns only text parts from message parts
 * Excludes base64 data URLs which should be rendered as images
 */
export function getTextParts(parts: MessagePart[]): TextPart[] {
  return parts.filter(
    (part): part is TextPart =>
      part.type === "text" && !isBase64DataUrl(part.text)
  );
}

/**
 * Filters and returns only image file parts from message parts
 */
export function getImageParts(parts: MessagePart[]): FilePart[] {
  return parts.filter(
    (part): part is FilePart =>
      part.type === "file" && !!part.mediaType?.startsWith("image/")
  );
}

/**
 * Combines multiple text parts into a single string.
 * Handles duplicate content and merges intelligently:
 * - Returns first non-null text if acc is null
 * - If new text includes accumulator, return new text (longer version)
 * - If accumulator includes new text, keep accumulator (already has it)
 * - Otherwise, concatenate with double newlines
 *
 * @param parts - Array of text parts to combine
 * @returns Combined text string or null if no valid text found
 */
export function combineTextParts(parts: TextPart[]): string | null {
  return parts.reduce<string | null>((acc, part) => {
    if (!part.text) {
      return acc;
    }

    if (acc === null) {
      return part.text;
    }

    // If new text includes the accumulator, use the new text (it's likely a longer version)
    if (part.text.includes(acc)) {
      return part.text;
    }

    // If accumulator already includes this text, keep the accumulator
    if (acc.includes(part.text)) {
      return acc;
    }

    // Otherwise, concatenate with double newlines
    return `${acc}\n\n${part.text}`;
  }, null);
}

/**
 * Checks if a message has any meaningful content (text or files)
 */
export function hasMessageContent(message: Message): boolean {
  const textParts = getTextParts(message.parts);
  const fileParts = getImageParts(message.parts);

  const hasText = textParts.some(
    (part) => part.text && part.text.trim().length > 0
  );
  const hasFiles = fileParts.length > 0;

  return hasText || hasFiles;
}

/**
 * Extracts combined text from a message
 */
export function getMessageText(message: Message): string | null {
  const textParts = getTextParts(message.parts);
  return combineTextParts(textParts);
}

/**
 * Checks if a message has an internal loading indicator
 * (e.g., incomplete expense-list-json block)
 */
export function hasInternalLoadingIndicator(message: Message): boolean {
  const text = getMessageText(message);
  if (!text) return false;

  // Check for incomplete expense list JSON block (streaming)
  const incompleteExpenseListRegex = /:::expense-list-json\s*\n([\s\S]*?)$/;
  return incompleteExpenseListRegex.test(text);
}
