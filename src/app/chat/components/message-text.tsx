import { memo, useMemo } from "react";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../chat.module.css";
import { getMessageText } from "../utils";
import { ExpenseList } from "./expense-list";
import type { Message, ExpenseListData } from "../types";

interface MessageTextProps {
  message: Message;
}

/**
 * Parses message content to extract expense list JSON blocks
 * Returns array of content segments (text or expense data)
 */
function parseMessageContent(
  text: string
): Array<
  | { type: "text"; content: string }
  | { type: "expense-list"; data: ExpenseListData["data"] }
  | { type: "loading-expense-list" }
> {
  const segments: Array<
    | { type: "text"; content: string }
    | { type: "expense-list"; data: ExpenseListData["data"] }
    | { type: "loading-expense-list" }
  > = [];

  // Match complete expense list JSON blocks
  const expenseListRegex = /:::expense-list-json\s*\n([\s\S]*?)\n:::end/g;
  // Match incomplete expense list JSON blocks (streaming)
  const incompleteExpenseListRegex = /:::expense-list-json\s*\n([\s\S]*?)$/;

  let lastIndex = 0;
  let match;

  while ((match = expenseListRegex.exec(text)) !== null) {
    // Add text before the expense list
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index).trim();
      if (textBefore) {
        segments.push({ type: "text", content: textBefore });
      }
    }

    // Parse and add expense list
    try {
      const jsonContent = match[1].trim();
      const parsed = JSON.parse(jsonContent);
      segments.push({
        type: "expense-list",
        data: parsed.data || parsed,
      });
    } catch (error) {
      // If parsing fails, show error message
      console.error("Failed to parse expense list JSON:", error);
      segments.push({
        type: "text",
        content: `[Error: No se pudo cargar la lista de gastos]`,
      });
    }

    lastIndex = expenseListRegex.lastIndex;
  }

  // Check for incomplete expense list (streaming)
  const remainingText = text.slice(lastIndex);
  const incompleteMatch = incompleteExpenseListRegex.exec(remainingText);

  if (incompleteMatch) {
    // Add text before the incomplete expense list
    const textBefore = remainingText.slice(0, incompleteMatch.index).trim();
    if (textBefore) {
      segments.push({ type: "text", content: textBefore });
    }

    // Add loading indicator for incomplete expense list
    segments.push({ type: "loading-expense-list" });
  } else {
    // Add remaining text after last expense list
    if (remainingText.trim()) {
      segments.push({ type: "text", content: remainingText.trim() });
    }
  }

  // If no segments were created, return the original text
  if (segments.length === 0 && text.trim()) {
    segments.push({ type: "text", content: text });
  }

  return segments;
}

/**
 * Renders the text content of a message with Markdown support
 * Detects and renders structured expense lists
 * Memoized to prevent unnecessary re-renders
 */
export const MessageText = memo(function MessageText({
  message,
}: MessageTextProps) {
  // Memoize the text extraction and combination
  const combinedText = useMemo(() => {
    return getMessageText(message);
  }, [message]);

  // Memoize the parsed content segments
  const contentSegments = useMemo(() => {
    if (!combinedText) return [];
    return parseMessageContent(combinedText);
  }, [combinedText]);

  if (!combinedText || contentSegments.length === 0) {
    return null;
  }

  return (
    <Box className={styles.messageText}>
      {contentSegments.map((segment, index) => {
        if (segment.type === "expense-list") {
          return <ExpenseList key={index} data={segment.data} />;
        }

        if (segment.type === "loading-expense-list") {
          return (
            <Flex key={index} gap="2" align="center" pt="2">
              <Spinner size="2" />
              <Text size="2" color="gray">
                Cargando lista de gastos...
              </Text>
            </Flex>
          );
        }

        // Render markdown text
        return (
          <Box key={index}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <div className={styles.responsiveTable}>
                    <table className={styles.desktopTable}>{children}</table>
                  </div>
                ),
              }}
            >
              {segment.content}
            </ReactMarkdown>
          </Box>
        );
      })}
    </Box>
  );
});
