"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./chat.module.css";

export default function Page() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <h1>💰 Expense Tracker</h1>
        <p>Gestiona tus gastos de forma inteligente</p>
      </header>

      <div className={styles.messagesContainer}>
        {messages.length === 0 && (
          <div className={styles.welcomeContainer}>
            <div className={styles.welcomeMessage}>
              <h2>¡Bienvenido a tu asistente de gastos! 👋</h2>
              <p>
                Estoy aquí para ayudarte a gestionar tus finanzas de manera inteligente.
              </p>
            </div>
            <button
              className={styles.helpButton}
              onClick={() => sendMessage({ text: "¿En qué puedes ayudarme?" })}>
              <span className={styles.helpIcon}>💡</span>
              ¿En qué puedo ayudarte?
            </button>
            <div className={styles.quickActions}>
              <button
                className={styles.quickActionButton}
                onClick={() => sendMessage({ text: "Deseo agregar un gasto nuevo" })}>
                <span>➕</span> Agregar gasto
              </button>
              <button
                className={styles.quickActionButton}
                onClick={() => sendMessage({ text: "Mostrar todos mis gastos" })}>
                <span>📊</span> Ver mis gastos
              </button>
              <div
                className={`${styles.quickActionButton} ${styles.quickActionButtonDisabled}`}
                title='En desarrollo 🔧...'>
                <span>📸</span> Tomar foto
              </div>
              <div
                className={`${styles.quickActionButton} ${styles.quickActionButtonDisabled}`}
                title='En desarrollo 🔧...'>
                <span>🖼️</span> Galería
              </div>
              {/* Inputs deshabilitados temporalmente */}
            </div>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? styles.messageUser : styles.messageAssistant
            }>
            <strong>{message.role === "user" ? "Tú: " : "Asistente: "}</strong>
            <div>
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <div key={index} className={styles.messageText}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => (
                            <div className='table-container'>
                              <table>{children}</table>
                            </div>
                          ),
                        }}>
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className={styles.errorContainer}>
          <div>❌ Ocurrió un error: {error.message}</div>
        </div>
      )}

      {(status === "submitted" || status === "streaming") && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Procesando...</p>
        </div>
      )}

      {/* Image preview - deshabilitado temporalmente */}

      <footer className={styles.chatFooter}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput("");
            }
          }}>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={status !== "ready"}
              placeholder='Pregunta sobre tus gastos o registra uno nuevo...'
            />

            {/* File inputs - deshabilitados temporalmente */}

            <div
              className={`${styles.fileButton} ${styles.fileButtonDisabled}`}
              title='En desarrollo 🔧...'>
              📸
            </div>

            <div
              className={`${styles.fileButton} ${styles.fileButtonDisabled}`}
              title='En desarrollo 🔧...'>
              🖼️
            </div>
            {status === "submitted" || status === "streaming" ? (
              <button type='button' onClick={() => stop()} className={styles.stopButton}>
                <span className={styles.buttonText}>Detener</span>
                <span className={styles.buttonIcon}>⏹️</span>
              </button>
            ) : (
              <button
                type='submit'
                disabled={status !== "ready" || !!error || input.length === 0}
                className={styles.submitButton}>
                <span className={styles.buttonText}>Enviar</span>
                <span className={styles.buttonIcon}>📤</span>
              </button>
            )}
          </div>
        </form>
      </footer>
    </div>
  );
}
