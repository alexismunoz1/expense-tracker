import {
  ChatBubbleIcon,
  ImageIcon,
  ArchiveIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import type { LandingFeature } from "@/types/landing.types";

export const LANDING_HERO = {
  TITLE: "Gestiona tus gastos de forma natural",
  SUBTITLE:
    "Finny es tu asistente financiero personal potenciado con IA. Registra gastos, escanea recibos y organiza tus finanzas simplemente conversando en español.",
  CTA_PRIMARY: "Comenzar ahora",
  CTA_SECONDARY: "Iniciar sesión",
} as const;

export const LANDING_FEATURES: readonly LandingFeature[] = [
  {
    id: "chat-conversacional",
    icon: ChatBubbleIcon,
    title: "Chat conversacional",
    description:
      "Gestiona tus gastos mediante lenguaje natural en español. Solo conversa con Finny como lo harías con un amigo.",
  },
  {
    id: "ocr-recibos",
    icon: ImageIcon,
    title: "Escaneo de recibos",
    description:
      "Procesa automáticamente tus recibos con tecnología OCR. Solo sube una foto y Finny extrae toda la información.",
  },
  {
    id: "categorizacion",
    icon: ArchiveIcon,
    title: "Categorización inteligente",
    description:
      "Organiza automáticamente tus gastos en categorías personalizables. Finny aprende de tus hábitos para categorizarlo todo.",
  },
  {
    id: "asistencia-ia",
    icon: MagicWandIcon,
    title: "Asistencia con IA",
    description:
      "Potenciado por Grok-3, Finny entiende contexto, detecta monedas automáticamente y te ayuda a tomar mejores decisiones financieras.",
  },
] as const;

export const LANDING_HEADER = {
  APP_NAME: "Finny",
  LOGIN_BUTTON: "Iniciar sesión",
  GO_TO_CHAT: "Ir al chat",
} as const;
