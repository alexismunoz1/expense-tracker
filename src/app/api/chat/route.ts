import { NextRequest } from "next/server";
import { xai } from "@ai-sdk/xai";
import { convertToModelMessages, streamText, UIMessage, stepCountIs } from "ai";
import { executeGestionarGasto, executeGestionarCategoria } from "@/utils/tools";
import { gestionarGastoSchema, gestionarCategoriaSchema } from "@/schemas/tools";

// const model = openai(process.env.OPENAI_MODEL || "gpt-4o-mini");

const model = xai("grok-3");

export async function POST(req: NextRequest) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model,
    system:
      "Eres un asistente de gastos personal. Usa formato Markdown para respuestas.\n\n**HERRAMIENTAS DISPONIBLES:**\n• gestionarGasto: crear/obtener/modificar gastos (accion: 'crear'|'obtener'|'modificar')\n• gestionarCategoria: crear/obtener categorías (accion: 'crear'|'obtener')\n• procesarImagenRecibo: analizar fotos de recibos con IA\n\n**IMPORTANTE:** Al ver [IMAGEN_DATA:base64:mimeType], usa 'procesarImagenRecibo' automáticamente.\n\nCategorías: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros\n\nTablas de gastos:\n| Descripción | Precio (USD) | Categoría | Fecha |\n|-------------|--------------|-----------|-------|\n| Gasto | $XX.XX | 🏷️ Cat | DD Mes YYYY |",
    messages: convertToModelMessages(messages),
    tools: {
      gestionarGasto: {
        type: "function",
        description:
          "Gestiona gastos (crear nuevos, obtener lista, modificar existentes). Incluye filtros avanzados para consultas específicas.",
        inputSchema: gestionarGastoSchema,
        execute: executeGestionarGasto,
      },
      gestionarCategoria: {
        type: "function",
        description:
          "Gestiona categorías de gastos (crear nuevas categorías personalizadas, obtener lista completa de categorías disponibles)",
        inputSchema: gestionarCategoriaSchema,
        execute: executeGestionarCategoria,
      },
      // procesarImagenRecibo: {
      //   type: "function",
      //   description:
      //     "Procesa una imagen de recibo para extraer datos automáticamente y crear un gasto. Utiliza IA para análisis de imágenes.",
      //   inputSchema: procesarImagenReciboSchema,
      //   execute: executeProcesarImagenRecibo,
      // },
    },
    stopWhen: stepCountIs(4),
  });

  return result.toUIMessageStreamResponse();
}
