import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Box } from "@radix-ui/themes";
import { getMessageText } from "../utils";
import type { Message } from "../types";
import styles from "../chat.module.css";

interface MessageTextProps {
  message: Message;
}

/**
 * Renders the text content of a message with Markdown support
 * Includes custom table rendering for responsive design
 * Memoized to prevent unnecessary re-renders
 */
export const MessageText = memo(function MessageText({
  message,
}: MessageTextProps) {
  // Memoize the text extraction and combination
  const combinedText = useMemo(() => {
    return getMessageText(message);
  }, [message]);

  if (!combinedText) {
    return null;
  }

  return (
    <Box className={styles.messageText}>
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
        {combinedText}
      </ReactMarkdown>
    </Box>
  );
});
