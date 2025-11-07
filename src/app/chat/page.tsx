"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import AuthButton from "@/components/AuthButton";
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  IconButton,
  TextField,
  Card,
  Callout,
  Spinner,
} from "@radix-ui/themes";
import {
  PaperPlaneIcon,
  StopIcon,
  CameraIcon,
  ImageIcon,
  QuestionMarkCircledIcon,
  PlusIcon,
  BarChartIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || (files && files.length > 0)) {
      sendMessage({
        text: input || "Analiza esta imagen y crea un gasto automáticamente",
        files,
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
  };

  const clearFiles = () => {
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = "";
    }
  };

  return (
    <Flex direction="column" style={{ height: "100vh", maxWidth: "800px", margin: "0 auto" }}>
      {/* Header */}
      <Box
        p="4"
        style={{
          background: "var(--accent-9)",
          borderBottom: "1px solid var(--gray-6)",
        }}
      >
        <Flex justify="between" align="center">
          <Flex direction="column" gap="1">
            <Heading size="6">💰 Expense Tracker</Heading>
            <Text size="2" style={{ opacity: 0.9 }}>
              Gestiona tus gastos de forma inteligente
            </Text>
          </Flex>
          <AuthButton />
        </Flex>
      </Box>

      {/* Messages Area */}
      <Box
        flexGrow="1"
        p="4"
        style={{
          overflowY: "auto",
          background: "var(--gray-3)",
        }}
      >
        {messages.length === 0 && (
          <Flex direction="column" align="center" justify="center" gap="6" style={{ minHeight: "300px" }}>
            <Flex direction="column" align="center" gap="2">
              <Heading size="7">¡Bienvenido a tu asistente de gastos! 👋</Heading>
              <Text color="gray" size="3" align="center">
                Estoy aquí para ayudarte a gestionar tus finanzas de manera inteligente.
              </Text>
            </Flex>

            <Button
              size="3"
              variant="soft"
              onClick={() => sendMessage({ text: "¿En qué puedes ayudarme?" })}
            >
              <QuestionMarkCircledIcon />
              ¿En qué puedo ayudarte?
            </Button>

            <Flex gap="3" wrap="wrap" justify="center" style={{ maxWidth: "600px" }}>
              <Button
                variant="surface"
                onClick={() => sendMessage({ text: "Deseo agregar un gasto nuevo" })}
              >
                <PlusIcon />
                Agregar gasto
              </Button>
              <Button
                variant="surface"
                onClick={() => sendMessage({ text: "Mostrar todos mis gastos" })}
              >
                <BarChartIcon />
                Ver mis gastos
              </Button>
              <Button variant="surface" onClick={() => cameraInputRef.current?.click()}>
                <CameraIcon />
                Tomar foto
              </Button>
              <Button variant="surface" onClick={() => fileInputRef.current?.click()}>
                <ImageIcon />
                Galería
              </Button>
            </Flex>
          </Flex>
        )}

        {messages.map((message) => (
          <Card
            key={message.id}
            mb="3"
            style={{
              maxWidth: "85%",
              marginLeft: message.role === "user" ? "auto" : "0",
              marginRight: message.role === "user" ? "0" : "auto",
              background: message.role === "user" ? "var(--indigo-9)" : "var(--gray-4)",
            }}
          >
            <Flex direction="column" gap="2">
              <Text weight="bold" size="2">
                {message.role === "user" ? "Tú" : "Asistente"}
              </Text>
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <Box key={index} className={styles.messageText}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ children }) => (
                            <div className="table-container">
                              <table>{children}</table>
                            </div>
                          ),
                        }}
                      >
                        {part.text}
                      </ReactMarkdown>
                    </Box>
                  );
                }

                if (part.type === "file" && part.mediaType?.startsWith("image/")) {
                  return (
                    <Box key={index}>
                      <Image
                        src={part.url}
                        alt={part.filename || "Imagen adjunta"}
                        width={400}
                        height={300}
                        style={{ borderRadius: "var(--radius-3)", maxWidth: "100%" }}
                        unoptimized
                      />
                    </Box>
                  );
                }

                return null;
              })}
            </Flex>
          </Card>
        ))}
      </Box>

      {/* Error Display */}
      {error && (
        <Box p="4">
          <Callout.Root color="red">
            <Callout.Text>❌ Ocurrió un error: {error.message}</Callout.Text>
          </Callout.Root>
        </Box>
      )}

      {/* Loading State */}
      {(status === "submitted" || status === "streaming") && (
        <Box p="4">
          <Flex align="center" gap="2">
            <Spinner />
            <Text>Procesando...</Text>
          </Flex>
        </Box>
      )}

      {/* Image Preview */}
      {files && files.length > 0 && (
        <Box
          p="4"
          style={{
            background: "var(--gray-2)",
            borderTop: "1px solid var(--gray-6)",
          }}
        >
          <Flex direction="column" gap="3">
            <Flex justify="between" align="center">
              <Text size="2" weight="medium">
                📎 Imágenes adjuntas ({files.length})
              </Text>
              <IconButton size="1" variant="ghost" onClick={clearFiles}>
                <Cross2Icon />
              </IconButton>
            </Flex>
            <Flex gap="2" wrap="wrap">
              {Array.from(files).map((file, index) => (
                <Card key={index} style={{ padding: "8px" }}>
                  <Flex direction="column" gap="2" align="center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "var(--radius-2)",
                      }}
                    />
                    <Text size="1" style={{ maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {file.name}
                    </Text>
                  </Flex>
                </Card>
              ))}
            </Flex>
          </Flex>
        </Box>
      )}

      {/* Input Area */}
      <Box
        p="4"
        style={{
          background: "var(--gray-2)",
          borderTop: "1px solid var(--gray-6)",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Flex gap="2" align="center">
            {/* Hidden file inputs */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(e.target.files);
                }
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFiles(e.target.files);
                }
              }}
            />

            {/* Input field */}
            <TextField.Root
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre tus gastos o registra uno nuevo..."
              disabled={status !== "ready"}
              size="3"
              style={{ flex: 1 }}
            />

            {/* Camera button */}
            <IconButton
              type="button"
              variant="surface"
              size="3"
              onClick={() => cameraInputRef.current?.click()}
              disabled={status !== "ready"}
              title="Tomar foto"
            >
              <CameraIcon />
            </IconButton>

            {/* Gallery button */}
            <IconButton
              type="button"
              variant="surface"
              size="3"
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== "ready"}
              title="Seleccionar de galería"
            >
              <ImageIcon />
            </IconButton>

            {/* Submit/Stop button */}
            {status === "submitted" || status === "streaming" ? (
              <Button type="button" color="red" size="3" onClick={() => stop()}>
                <StopIcon />
                Detener
              </Button>
            ) : (
              <Button
                type="submit"
                size="3"
                disabled={status !== "ready" || !!error || (input.length === 0 && (!files || files.length === 0))}
              >
                <PaperPlaneIcon />
                Enviar
              </Button>
            )}
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
