/**
 * Chat types for AI-powered expense tracking assistant
 */

import type { CurrencyCode } from "@/types/expense";

/**
 * Chat status indicates the current state of the chat interaction
 */
export type ChatStatus = "ready" | "submitted" | "streaming";

/**
 * Message part can be either text or a file attachment
 */
export type MessagePart =
  | {
      type: "text";
      text?: string;
    }
  | {
      type: "file";
      url: string;
      filename?: string;
      mediaType?: string;
    };

/**
 * Text-only message part (used for filtering)
 */
export type TextPart = Extract<MessagePart, { type: "text" }>;

/**
 * File-only message part (used for filtering)
 */
export type FilePart = Extract<MessagePart, { type: "file" }>;

/**
 * Message role - either from user or AI assistant
 */
export type MessageRole = "user" | "assistant";

/**
 * Complete message structure with parts
 */
export interface Message {
  id: string;
  role: MessageRole;
  parts: MessagePart[];
}

/**
 * Parameters for sending a message
 */
export interface SendMessageParams {
  text?: string;
  files?: FileList;
}

/**
 * Quick action configuration for welcome screen
 */
export interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType;
  message?: string;
  onClick?: () => void;
  requiresAction?: boolean;
}

/**
 * Display data for a single expense item in the expense list
 */
export interface ExpenseItemDisplay {
  id: string;
  titulo: string;
  precio: number;
  currency: CurrencyCode;
  categoria: string;
  categoriaIcono?: string;
  categoriaColor?: string;
  fecha: string; // ISO 8601 timestamp
}

/**
 * Structured expense list data returned by AI
 */
export interface ExpenseListData {
  type: "expense-list";
  data: {
    expenses: ExpenseItemDisplay[];
    total?: string; // Formatted total amount
    count: number;
  };
}
