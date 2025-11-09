import { xai } from "@ai-sdk/xai";
import { convertToModelMessages, streamText, stepCountIs, tool } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  gestionarGastoSchema,
  gestionarCategoriaSchema,
} from "@/schemas/tools";
import {
  executeGestionarGasto,
  executeGestionarCategoria,
  executeProcesarImagenRecibo,
} from "@/utils/tools";
import { getUserProfile } from "@/utils/user-profile";
import type { UIMessage } from "ai";
import type { NextRequest } from "next/server";

const model = xai("grok-3");

// Función helper para filtrar imágenes de los mensajes
// Grok-3 no soporta imágenes, solo texto
const removeImagesFromMessages = (messages: UIMessage[]): UIMessage[] => {
  return messages.map((msg) => {
    if (msg.parts) {
      // Filtrar solo las partes de texto, eliminar imágenes
      const textParts = msg.parts.filter((part) => part.type === "text");
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
    // Check authentication
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Get user profile to determine preferred currency
    const userProfile = await getUserProfile(userId);
    const userCurrency = userProfile?.preferred_currency || "USD";
    const currencyName =
      userCurrency === "USD" ? "dólares (USD)" : "pesos argentinos (ARS)";

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
    const hasImage = lastMessage?.parts?.some(
      (part) => part.type === "file" && part.mediaType?.startsWith("image/")
    );

    if (hasImage) {
      const imagePart = lastMessage.parts.find(
        (part) => part.type === "file" && part.mediaType?.startsWith("image/")
      );
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
          processingResult = await executeProcesarImagenRecibo(
            {
              imagenBase64: base64Data,
              mimeType,
            },
            userId
          );
        } catch (error) {
          console.error("Error al procesar imagen:", error);
          processingResult = {
            message: `❌ **Error al procesar la imagen**

${error instanceof Error ? error.message : "Error desconocido"}

Por favor, intenta nuevamente o registra el gasto manualmente proporcionando los datos.`,
          };
        }

        // Determinar el system prompt basado en si se requiere clarificación
        let systemPrompt = `Eres un asistente de gastos personal. Usa formato Markdown para respuestas.

**HERRAMIENTAS DISPONIBLES:**
• gestionarGasto: crear/obtener/modificar gastos (accion: 'crear'|'obtener'|'modificar')
• gestionarCategoria: crear/obtener categorías (accion: 'crear'|'obtener')

**IMPORTANTE - USO DE HERRAMIENTAS:**
- Cuando el usuario pida crear, modificar u obtener gastos/categorías, ejecuta la herramienta correspondiente INMEDIATAMENTE
- NO generes texto de confirmación ANTES de usar la herramienta (ej: "¡Entendido! Voy a registrar...")
- SOLO responde DESPUÉS de que la herramienta se haya ejecutado, mostrando los resultados
- NUNCA muestres el ID del gasto al usuario en respuestas individuales
- Cuando muestres fechas individuales, formátealas en español (ej: "8 de noviembre de 2025" en lugar de ISO 8601)

Categorías: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros

**CONFIGURACIÓN DE DIVISA:**
- Divisa preferida del usuario: ${currencyName}
- El usuario puede especificar una divisa diferente al crear un gasto (ej: "50 USD" o "1000 ARS")
- Si el usuario NO especifica divisa, usa su divisa preferida (${userCurrency})
- Divisas disponibles: USD (dólares estadounidenses), ARS (pesos argentinos)
- Cuando uses la herramienta gestionarGasto, incluye el campo 'divisa' solo si el usuario especifica una divisa diferente a ${userCurrency}

**FORMATO DE LISTADO DE GASTOS:**
Cuando muestres una lista de gastos (2 o más), usa SIEMPRE el formato JSON estructurado.

**IMPORTANTE - PREPARACIÓN DE DATOS:**
Para crear el JSON con información completa:
1. Llama a gestionarCategoria con accion: "obtener" para obtener todas las categorías
2. Llama a gestionarGasto con accion: "obtener" (con filtros si aplica) para obtener gastos
3. Combina los datos: para cada gasto, busca su categoría por el campo "categoria" (que es el ID)
4. Incluye el icono y color de la categoría en el JSON

Para listar gastos, envuelve el JSON entre marcadores especiales:
:::expense-list-json
{
  "type": "expense-list",
  "data": {
    "expenses": [
      {
        "id": "abc123",
        "titulo": "Supermercado",
        "precio": 5000,
        "currency": "ARS",
        "categoria": "alimentacion",
        "categoriaIcono": "🍔",
        "categoriaColor": "orange",
        "fecha": "2025-11-07T10:30:00.000Z"
      }
    ],
    "total": "$73,010.00 ARS",
    "count": 6
  }
}
:::end

**IMPORTANTE:**
- SOLO usa este formato cuando listes 2 o más gastos
- Para un solo gasto o crear/modificar, usa respuesta de texto normal
- El campo "total" debe incluir el símbolo de moneda y el código (ej: "$5,000.00 ARS")
- Las fechas en el JSON deben mantener el formato ISO 8601
- Puedes incluir texto descriptivo ANTES o DESPUÉS del bloque JSON
- Ejemplo: "He encontrado 6 gastos: [JSON aquí] ¿Necesitas filtrar por categoría?"

**IMPORTANTE - FORMATO DE FECHAS:**
- Las fechas vienen en formato ISO 8601 (ej: "2025-11-06T20:05:18.599Z")
- En el JSON, mantén el formato ISO 8601
- El componente visual se encargará de formatearlas en español
- NUNCA uses placeholder como "[Fecha actual]" - SIEMPRE usa la fecha real`;

        // Si se requiere clarificación, agregar instrucciones especiales
        if (
          processingResult.requiresClarification &&
          processingResult.extractedData
        ) {
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
        const messagesWithoutImages = removeImagesFromMessages(
          messages.slice(0, -1)
        );

        const result = streamText({
          model,
          system: systemPrompt,
          messages: [
            ...convertToModelMessages(messagesWithoutImages),
            {
              role: "user",
              content:
                lastMessage.parts.find((p) => p.type === "text")?.text ||
                "Analiza esta imagen y crea un gasto automáticamente",
            },
            {
              role: "assistant",
              content:
                processingResult.message ||
                "El recibo ha sido procesado y el gasto ha sido registrado.",
            },
          ],
          tools: {
            gestionarGasto: tool({
              description:
                "Gestiona gastos (crear nuevos, obtener lista, modificar existentes). Incluye filtros avanzados para consultas específicas.",
              inputSchema: gestionarGastoSchema,
              execute: async (input) => executeGestionarGasto(input, userId),
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
      system: `Eres un asistente de gastos personal. Usa formato Markdown para respuestas.

**HERRAMIENTAS DISPONIBLES:**
• gestionarGasto: crear/obtener/modificar gastos (accion: 'crear'|'obtener'|'modificar')
• gestionarCategoria: crear/obtener categorías (accion: 'crear'|'obtener')
• procesarImagenRecibo: analizar fotos de recibos con IA para extraer datos y crear gastos automáticamente

**IMPORTANTE - USO DE HERRAMIENTAS:**
- Cuando el usuario pida crear, modificar u obtener gastos/categorías, ejecuta la herramienta correspondiente INMEDIATAMENTE
- NO generes texto de confirmación ANTES de usar la herramienta (ej: "¡Entendido! Voy a registrar...")
- SOLO responde DESPUÉS de que la herramienta se haya ejecutado, mostrando los resultados
- Cuando el usuario envíe una imagen de recibo, factura o ticket, usa automáticamente la herramienta 'procesarImagenRecibo' para analizarla y crear el gasto

**MANEJO DE ACLARACIONES DE RECIBOS:**
Si en un mensaje anterior procesaste un recibo pero el nombre no estaba claro:
1. Revisa tu mensaje anterior para encontrar el monto y la categoría detectados
2. Cuando el usuario responda con un nombre/descripción, usa 'gestionarGasto' con acción 'crear'
3. Extrae el precio y categoría de tu mensaje anterior
4. Usa el título que proporcionó el usuario
5. Confirma que el gasto fue registrado exitosamente con todos los detalles

Categorías: alimentacion, transporte, entretenimiento, salud, educacion, servicios, otros

**CONFIGURACIÓN DE DIVISA:**
- Divisa preferida del usuario: ${currencyName}
- El usuario puede especificar una divisa diferente al crear un gasto (ej: "50 USD" o "1000 ARS")
- Si el usuario NO especifica divisa, usa su divisa preferida (${userCurrency})
- Divisas disponibles: USD (dólares estadounidenses), ARS (pesos argentinos)
- Cuando uses la herramienta gestionarGasto, incluye el campo 'divisa' solo si el usuario especifica una divisa diferente a ${userCurrency}
- Ejemplos de detección:
  - "gasté $50 en comida" → usa ${userCurrency} (sin especificar divisa en tool)
  - "gasté 50 USD en Amazon" → usa USD (especificar divisa: 'USD' en tool)
  - "gasté 1000 pesos en el super" → usa ARS (especificar divisa: 'ARS' en tool)

**FORMATO DE LISTADO DE GASTOS:**
Cuando muestres una lista de gastos (2 o más), usa SIEMPRE el formato JSON estructurado.

**IMPORTANTE - PREPARACIÓN DE DATOS:**
Para crear el JSON con información completa:
1. Llama a gestionarCategoria con accion: "obtener" para obtener todas las categorías
2. Llama a gestionarGasto con accion: "obtener" (con filtros si aplica) para obtener gastos
3. Combina los datos: para cada gasto, busca su categoría por el campo "categoria" (que es el ID)
4. Incluye el icono y color de la categoría en el JSON

Para listar gastos, envuelve el JSON entre marcadores especiales:
:::expense-list-json
{
  "type": "expense-list",
  "data": {
    "expenses": [
      {
        "id": "abc123",
        "titulo": "Supermercado",
        "precio": 5000,
        "currency": "ARS",
        "categoria": "alimentacion",
        "categoriaIcono": "🍔",
        "categoriaColor": "orange",
        "fecha": "2025-11-07T10:30:00.000Z"
      }
    ],
    "total": "$73,010.00 ARS",
    "count": 6
  }
}
:::end

**IMPORTANTE:**
- SOLO usa este formato cuando listes 2 o más gastos
- Para un solo gasto o crear/modificar, usa respuesta de texto normal
- El campo "total" debe incluir el símbolo de moneda y el código (ej: "$5,000.00 ARS")
- Las fechas en el JSON deben mantener el formato ISO 8601
- Puedes incluir texto descriptivo ANTES o DESPUÉS del bloque JSON
- Ejemplo: "He encontrado 6 gastos: [JSON aquí] ¿Necesitas filtrar por categoría?"

**IMPORTANTE - FORMATO DE FECHAS:**
- Las fechas vienen en formato ISO 8601 (ej: "2025-11-06T20:05:18.599Z")
- En el JSON, mantén el formato ISO 8601
- El componente visual se encargará de formatearlas en español
- NUNCA uses placeholder como "[Fecha actual]" - SIEMPRE usa la fecha real`,
      messages: convertToModelMessages(messagesWithoutImages),
      tools: {
        gestionarGasto: tool({
          description:
            "Gestiona gastos (crear nuevos, obtener lista, modificar existentes). Incluye filtros avanzados para consultas específicas.",
          inputSchema: gestionarGastoSchema,
          execute: async (input) => executeGestionarGasto(input, userId),
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
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
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
