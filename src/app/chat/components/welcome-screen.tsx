import { memo } from "react";
import {
  QuestionMarkCircledIcon,
  PlusIcon,
  BarChartIcon,
  CameraIcon,
  ImageIcon,
} from "@radix-ui/react-icons";
import { Flex, Heading, Text, Button } from "@radix-ui/themes";
import type { SendMessageParams } from "../types";

const CONTAINER_STYLE = { minHeight: "300px" } as const;
const ACTIONS_STYLE = { maxWidth: "600px" } as const;

interface WelcomeScreenProps {
  onSendMessage: (params: SendMessageParams) => void;
  onCameraClick: () => void;
  onGalleryClick: () => void;
}

/**
 * Welcome screen shown when there are no messages yet
 * Provides quick action buttons for common tasks
 * Memoized to prevent unnecessary re-renders
 */
export const WelcomeScreen = memo(function WelcomeScreen({
  onSendMessage,
  onCameraClick,
  onGalleryClick,
}: WelcomeScreenProps) {
  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      gap="6"
      style={CONTAINER_STYLE}
    >
      <Flex direction="column" align="center" gap="2">
        <Heading size="7" align="center">
          ¡Bienvenido a tu asistente de gastos! ✨
        </Heading>
        <Text color="gray" size="3" align="center">
          Estoy aquí para ayudarte a gestionar tus finanzas de manera
          inteligente.
        </Text>
      </Flex>

      <Button
        size="3"
        variant="soft"
        onClick={() => onSendMessage({ text: "¿En qué puedes ayudarme?" })}
      >
        <QuestionMarkCircledIcon />
        ¿En qué puedo ayudarte?
      </Button>

      <Flex gap="3" wrap="wrap" justify="center" style={ACTIONS_STYLE}>
        <Button
          variant="surface"
          onClick={() =>
            onSendMessage({ text: "Deseo agregar un gasto nuevo" })
          }
        >
          <PlusIcon />
          Agregar gasto
        </Button>
        <Button
          variant="surface"
          onClick={() => onSendMessage({ text: "Mostrar todos mis gastos" })}
        >
          <BarChartIcon />
          Ver mis gastos
        </Button>
        <Button variant="surface" onClick={onCameraClick}>
          <CameraIcon />
          Tomar foto
        </Button>
        <Button variant="surface" onClick={onGalleryClick}>
          <ImageIcon />
          Galería
        </Button>
      </Flex>
    </Flex>
  );
});
