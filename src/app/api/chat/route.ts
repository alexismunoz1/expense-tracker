import { NextRequest, NextResponse } from "next/server";
import { xai } from "@ai-sdk/xai";
import { convertToModelMessages, streamText, UIMessage, stepCountIs, tool } from "ai";
import { executeGestionarGasto, executeGestionarCategoria, executeProcesarImagenRecibo } from "@/utils/tools";
import { gestionarGastoSchema, gestionarCategoriaSchema } from "@/schemas/tools";
import { z } from "zod";


const model = xai("grok-3");

// Función helper para filtrar imágenes de los mensajes
// Grok-3 no soporta imágenes, solo texto
const removeImagesFromMessages = (messages: UIMessage[]): UIMessage[] => {
  return messages.map(msg => {
    if (msg.parts) {
      // Filtrar solo las partes de texto, eliminar imágenes
      const textParts = msg.parts.filter(part => part.type === "text");
      return {
        ...msg,
        parts: textParts,
      };
    }
    return msg;
  });
};

// Schema de validación para el request body
const requestSchema = z.object({
  messages: z.array(z.any()).min(1, "Se requiere al menos un mensaje"),
});

export async function POST(req: NextRequest) {
  try {
    // Validar request body
    const body = await req.json();
    const validation = requestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Request inválido", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { messages }: { messages: UIMessage[] } = validation.data;


    const lastMessage = messages[messages.length - 1];
    const hasImage = lastMessage?.parts?.some(part => part.type === "file" && part.mediaType?.startsWith("image/"));

    if (hasImage) {
      const imagePart = lastMessage.parts.find(part => part.type === "file" && part.mediaType?.startsWith("image/"));
      if (imagePart && imagePart.type === "file") {
        const imageUrl = imagePart.url;
        let base64Data: string;
        let mimeType: string = imagePart.mediaType || "image/jpeg";

        if (imageUrl.startsWith("data:")) {
          const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
          if (match) {
            mimeType = match[1];
            base64Data = match[2];
          } else {
            base64Data = imageUrl;
          }
        } else {
          return NextResponse.json(
            { error: "Las imágenes deben estar en formato data URL" },
            { status: 400 }
          );
        }

        let processingResult;
        try {
          processingResult = await executeProcesarImagenRecibo({
            imagenBase64: base64Data,
            mimeType,
          });
        } catch (error) {
          console.error("Error al procesar imagen:", error);
          processingResult = {
            message: `❌ **Error al procesar la imagen**

${error instanceof Error ? error.message : "Error desconocido"}

Por favor, intenta nuevamente o registra el gasto manualmente proporcionando los datos.`,
          };
        }

        // Determinar el system prompt basado en si se requiere clarificación
        let systemPrompt =
          "Eres un asistente de gastos personal. Usa formato Markdown para respuestas.\n\n**HERRAMIENTAS DISPONIBLES:**\n• gestionarGasto: crear/obtener/modificar gastos (accion: 'crear'|'obtener'|'modificar')\n• gestionarCategoria: crear/obtener categorías (accion: 'crear'|'obtener')\n\nCategorías: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros\n\nTablas de gastos:\n| Descripción | Precio (USD) | Categoría | Fecha |\n|-------------|--------------|-----------|-------|\n| Gasto | $XX.XX | 🏷️ Cat | DD Mes YYYY |";

        // Si se requiere clarificación, agregar instrucciones especiales
        if (processingResult.requiresClarification && processingResult.extractedData) {
          const { amount, category } = processingResult.extractedData;
          systemPrompt += `\n\n**CONTEXTO IMPORTANTE - RECIBO PENDIENTE:**
He procesado un recibo pero la descripción no está clara. Los datos detectados son:
- Monto: $${amount.toFixed(2)}
- Categoría: ${category}

INSTRUCCIONES:
1. Muestra el mensaje de procesamiento al usuario (ya está en tu contexto)
2. Solicita al usuario que proporcione un nombre descriptivo para el gasto
3. Cuando el usuario responda con un nombre, usa la herramienta 'gestionarGasto' con acción 'crear' para registrar el gasto
4. Usa estos datos: título=(nombre del usuario), precio=${amount.toFixed(2)}, categoria="${category}"
5. NO preguntes por el monto o categoría, ya los tengo detectados

Ejemplo de respuesta esperada del usuario: "Supermercado Central" o "Farmacia del Centro"`;
        }

        // Filtrar imágenes de mensajes anteriores antes de enviar al modelo
        const messagesWithoutImages = removeImagesFromMessages(messages.slice(0, -1));

        const result = streamText({
          model,
          system: systemPrompt,
          messages: [
            ...convertToModelMessages(messagesWithoutImages),
            {
              role: "user",
              content: lastMessage.parts.find(p => p.type === "text")?.text || "Analiza esta imagen y crea un gasto automáticamente",
            },
            {
              role: "assistant",
              content: processingResult.message || "El recibo ha sido procesado y el gasto ha sido registrado.",
            },
          ],
          tools: {
            gestionarGasto: tool({
              description:
                "Gestiona gastos (crear nuevos, obtener lista, modificar existentes). Incluye filtros avanzados para consultas específicas.",
              inputSchema: gestionarGastoSchema,
              execute: executeGestionarGasto,
            }),
            gestionarCategoria: tool({
              description:
                "Gestiona categorías de gastos (crear nuevas categorías personalizadas, obtener lista completa de categorías disponibles)",
              inputSchema: gestionarCategoriaSchema,
              execute: executeGestionarCategoria,
            }),
          },
          stopWhen: stepCountIs(4),
        });

        return result.toUIMessageStreamResponse();
      }
    }

    // Filtrar imágenes de todos los mensajes antes de enviar al modelo
    const messagesWithoutImages = removeImagesFromMessages(messages);

    const result = streamText({
      model,
      system:
        "Eres un asistente de gastos personal. Usa formato Markdown para respuestas.\n\n**HERRAMIENTAS DISPONIBLES:**\n• gestionarGasto: crear/obtener/modificar gastos (accion: 'crear'|'obtener'|'modificar')\n• gestionarCategoria: crear/obtener categorías (accion: 'crear'|'obtener')\n• procesarImagenRecibo: analizar fotos de recibos con IA para extraer datos y crear gastos automáticamente\n\n**IMPORTANTE:** Cuando el usuario envíe una imagen de recibo, factura o ticket, usa automáticamente la herramienta 'procesarImagenRecibo' para analizarla y crear el gasto.\n\n**MANEJO DE ACLARACIONES DE RECIBOS:**\nSi en un mensaje anterior procesaste un recibo pero el nombre no estaba claro:\n1. Revisa tu mensaje anterior para encontrar el monto y la categoría detectados\n2. Cuando el usuario responda con un nombre/descripción, usa 'gestionarGasto' con acción 'crear'\n3. Extrae el precio y categoría de tu mensaje anterior\n4. Usa el título que proporcionó el usuario\n5. Confirma que el gasto fue registrado exitosamente con todos los detalles\n\nCategorías: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros\n\nTablas de gastos:\n| Descripción | Precio (USD) | Categoría | Fecha |\n|-------------|--------------|-----------|-------|\n| Gasto | $XX.XX | 🏷️ Cat | DD Mes YYYY |",
      messages: convertToModelMessages(messagesWithoutImages),
      tools: {
        gestionarGasto: tool({
          description:
            "Gestiona gastos (crear nuevos, obtener lista, modificar existentes). Incluye filtros avanzados para consultas específicas.",
          inputSchema: gestionarGastoSchema,
          execute: executeGestionarGasto,
        }),
        gestionarCategoria: tool({
          description:
            "Gestiona categorías de gastos (crear nuevas categorías personalizadas, obtener lista completa de categorías disponibles)",
          inputSchema: gestionarCategoriaSchema,
          execute: executeGestionarCategoria,
        }),
      },
      stopWhen: stepCountIs(4),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error en /api/chat:", error);

    // Retornar un stream response incluso en caso de error
    // para que useChat actualice correctamente su status
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    const result = streamText({
      model,
      system: "Eres un asistente de gastos personal.",
      messages: [
        {
          role: "user",
          content: `Ha ocurrido un error: ${errorMessage}. Por favor, intenta nuevamente o contacta al soporte si el problema persiste.`,
        },
      ],
    });

    return result.toUIMessageStreamResponse();
  }
}
