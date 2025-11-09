import { memo, useMemo } from "react";
import { Box, Flex, Spinner, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../chat.module.css";
import { getMessageText } from "../utils";
import { ExpenseCard } from "./expense-card/expense-card";
import { ExpenseList } from "./expense-list/expense-list";
import type { Message, ExpenseListData, ExpenseCreatedData } from "../types";

interface MessageTextProps {
  message: Message;
}

/**
 * Parses message content to extract expense list and expense created JSON blocks
 * Returns array of content segments (text or expense data)
 */
function parseMessageContent(
  text: string
): Array<
  | { type: "text"; content: string }
  | { type: "expense-list"; data: ExpenseListData["data"] }
  | { type: "expense-created"; data: ExpenseCreatedData["data"] }
  | { type: "loading-expense-list" }
  | { type: "loading-expense-created" }
> {
  const segments: Array<
    | { type: "text"; content: string }
    | { type: "expense-list"; data: ExpenseListData["data"] }
    | { type: "expense-created"; data: ExpenseCreatedData["data"] }
    | { type: "loading-expense-list" }
    | { type: "loading-expense-created" }
  > = [];

  // Match complete expense list JSON blocks
  const expenseListRegex = /:::expense-list-json\s*\n([\s\S]*?)\n:::end/g;
  // Match complete expense created JSON blocks
  const expenseCreatedRegex = /:::expense-created-json\s*\n([\s\S]*?)\n:::end/g;
  // Match incomplete expense list JSON blocks (streaming)
  const incompleteExpenseListRegex = /:::expense-list-json\s*\n([\s\S]*?)$/;
  // Match incomplete expense created JSON blocks (streaming)
  const incompleteExpenseCreatedRegex =
    /^:::expense-created-json\s*\n([\s\S]*?)$/;

  // Collect all matches with their positions
  const matches: Array<{
    index: number;
    lastIndex: number;
    type: "expense-list" | "expense-created";
    content: string;
  }> = [];

  // Collect expense list matches
  let match;
  while ((match = expenseListRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      lastIndex: expenseListRegex.lastIndex,
      type: "expense-list",
      content: match[1].trim(),
    });
  }

  // Collect expense created matches
  while ((match = expenseCreatedRegex.exec(text)) !== null) {
    matches.push({
      index: match.index,
      lastIndex: expenseCreatedRegex.lastIndex,
      type: "expense-created",
      content: match[1].trim(),
    });
  }

  // Sort matches by position in text
  matches.sort((a, b) => a.index - b.index);

  let lastIndex = 0;

  // Process all matches in order
  for (const matchData of matches) {
    // Add text before this match
    if (matchData.index > lastIndex) {
      const textBefore = text.slice(lastIndex, matchData.index).trim();
      if (textBefore) {
        segments.push({ type: "text", content: textBefore });
      }
    }

    // Parse and add the matched content
    try {
      const parsed = JSON.parse(matchData.content);
      if (matchData.type === "expense-list") {
        segments.push({
          type: "expense-list",
          data: parsed.data || parsed,
        });
      } else {
        segments.push({
          type: "expense-created",
          data: parsed.data || parsed,
        });
      }
    } catch (error) {
      // If parsing fails, show error message
      console.error(`Failed to parse ${matchData.type} JSON:`, error);
      segments.push({
        type: "text",
        content: `[Error: No se pudo cargar ${matchData.type === "expense-list" ? "la lista de gastos" : "el gasto"}]`,
      });
    }

    lastIndex = matchData.lastIndex;
  }

  // Check for incomplete blocks (streaming)
  const remainingText = text.slice(lastIndex);
  const incompleteListMatch = incompleteExpenseListRegex.exec(remainingText);
  const incompleteCreatedMatch =
    incompleteExpenseCreatedRegex.exec(remainingText);

  // Determine which incomplete match appears first (if any)
  let incompleteMatch = null;
  let incompleteType: "list" | "created" | null = null;

  if (incompleteListMatch && incompleteCreatedMatch) {
    if (incompleteListMatch.index < incompleteCreatedMatch.index) {
      incompleteMatch = incompleteListMatch;
      incompleteType = "list";
    } else {
      incompleteMatch = incompleteCreatedMatch;
      incompleteType = "created";
    }
  } else if (incompleteListMatch) {
    incompleteMatch = incompleteListMatch;
    incompleteType = "list";
  } else if (incompleteCreatedMatch) {
    incompleteMatch = incompleteCreatedMatch;
    incompleteType = "created";
  }

  if (incompleteMatch && incompleteType) {
    // Add text before the incomplete block
    const textBefore = remainingText.slice(0, incompleteMatch.index).trim();
    if (textBefore) {
      segments.push({ type: "text", content: textBefore });
    }

    // Add loading indicator
    if (incompleteType === "list") {
      segments.push({ type: "loading-expense-list" });
    } else {
      segments.push({ type: "loading-expense-created" });
    }
  } else {
    // Add remaining text after all matches
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

        if (segment.type === "expense-created") {
          return (
            <Flex
              key={index}
              direction="column"
              my="4"
              pt="2"
              style={{
                borderRadius: "var(--radius-3)",
                backgroundColor: "var(--bg-secondary)",
                paddingBottom: "var(--space-3)",
              }}
            >
              <ExpenseCard expense={segment.data} />
            </Flex>
          );
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

        if (segment.type === "loading-expense-created") {
          return (
            <Flex key={index} gap="2" align="center" pt="2">
              <Spinner size="2" />
              <Text size="2" color="gray">
                Registrando gasto...
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
