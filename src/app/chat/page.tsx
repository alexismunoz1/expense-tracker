"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import styles from "./chat.module.css";

export default function Page() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  console.log("status", status);

  return (
    <div className={styles.chatContainer}>
      <header className={styles.chatHeader}>
        <div>
          <h1>💰 Expense Tracker</h1>
          <p>Gestiona tus gastos de forma inteligente</p>
        </div>
        <AuthButton />
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
              <button
                className={styles.quickActionButton}
                onClick={() => cameraInputRef.current?.click()}>
                <span>📸</span> Tomar foto
              </button>
              <button
                className={styles.quickActionButton}
                onClick={() => fileInputRef.current?.click()}>
                <span>🖼️</span> Galería
              </button>
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

                if (part.type === "file" && part.mediaType?.startsWith("image/")) {
                  return (
                    <div key={index} className={styles.imageContainer}>
                      <Image
                        src={part.url}
                        alt={part.filename || "Imagen adjunta"}
                        width={400}
                        height={300}
                        className={styles.messageImage}
                        unoptimized
                      />
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

      {files && files.length > 0 && (
        <div className={styles.imagePreviewContainer}>
          <div className={styles.imagePreviewHeader}>
            <span>📎 Imágenes adjuntas ({files.length})</span>
            <button
              type='button'
              onClick={() => {
                setFiles(undefined);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
                if (cameraInputRef.current) {
                  cameraInputRef.current.value = "";
                }
              }}
              className={styles.clearFilesButton}>
              ✕
            </button>
          </div>
          <div className={styles.imagePreviewGrid}>
            {Array.from(files).map((file, index) => (
              <div key={index} className={styles.imagePreviewItem}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className={styles.imagePreview}
                />
                <span className={styles.imagePreviewName}>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className={styles.chatFooter}>
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() || (files && files.length > 0)) {
              sendMessage({ 
                text: input || "Analiza esta imagen y crea un gasto automáticamente",
                files 
              });
              setInput("");
              setFiles(undefined);
              if (fileInputRef.current) {
                fileInputRef.current.value = "";
              }
              if (cameraInputRef.current) {
                cameraInputRef.current.value = "";
              }
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

            <input
              ref={cameraInputRef}
              type='file'
              accept='image/*'
              capture='environment'
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(e.target.files);
                }
              }}
            />

            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(e.target.files);
                }
              }}
            />

            <button
              type='button'
              className={styles.fileButton}
              title='Tomar foto'
              onClick={() => cameraInputRef.current?.click()}
              disabled={status !== "ready"}>
              📸
            </button>

            <button
              type='button'
              className={styles.fileButton}
              title='Seleccionar de galería'
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== "ready"}>
              🖼️
            </button>
            {status === "submitted" || status === "streaming" ? (
              <button type='button' onClick={() => stop()} className={styles.stopButton}>
                <span className={styles.buttonText}>Detener</span>
                <span className={styles.buttonIcon}>⏹️</span>
              </button>
            ) : (
              <button
                type='submit'
                disabled={
                  status !== "ready" ||
                  !!error ||
                  (input.length === 0 && (!files || files.length === 0))
                }
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
