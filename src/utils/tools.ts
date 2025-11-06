import { createWorker } from "tesseract.js";
import { nanoid } from "nanoid";
import { Expense, Category } from "@/types/expense";
import {
  GestionarGastoInput,
  GestionarCategoriaInput,
  ProcesarImagenReciboInput,
  GastoResponse,
  CategoriaResponse,
  GuardarGastoInput,
  CrearCategoriaInput,
  ModificarGastoInput,
  CrearGastoResponse,
  ObtenerGastosResponse,
  CrearCategoriaResponse,
  ObtenerCategoriasResponse,
  ModificarGastoResponse,
  OcrResult,
  ExtractedOcrData,
  isValidGastoAccion,
  isValidCategoriaAccion,
  CAMPOS_REQUERIDOS_CREAR_GASTO,
  CAMPOS_REQUERIDOS_CREAR_CATEGORIA,
  CAMPOS_REQUERIDOS_MODIFICAR_GASTO,
  GASTO_ACCIONES,
  CATEGORIA_ACCIONES,
} from "@/types/tools";
import {
  saveExpense,
  getExpenses,
  saveCategory,
  getCategories,
  updateExpense,
  getExpenseById,
} from "./expenses";

// === FUNCIONES AGRUPADAS ===

// Gestor principal de gastos
export const executeGestionarGasto = async ({ accion, datos }: GestionarGastoInput, userId: string): Promise<GastoResponse> => {
  try {
    // Validar acción
    if (!isValidGastoAccion(accion)) {
      return {
        success: false,
        message: `Acción no válida. Acciones permitidas: ${GASTO_ACCIONES.join(', ')}`,
      };
    }

    switch (accion) {
      case 'crear':
        // Validar campos requeridos usando constantes
        const camposFaltantes = CAMPOS_REQUERIDOS_CREAR_GASTO.filter(
          campo => !datos[campo as keyof typeof datos]
        );

        if (camposFaltantes.length > 0) {
          return {
            success: false,
            message: `Para crear un gasto necesitas: ${camposFaltantes.join(', ')}`,
          };
        }
        return await executeGuardarGasto({
          titulo: datos.titulo!,
          precio: datos.precio!,
          categoria: datos.categoria!,
        }, userId);

      case 'obtener':
        const expenses = await getExpenses();
        let filteredExpenses = expenses;

        // Aplicar filtros si existen
        if (datos.filtros?.categoria) {
          filteredExpenses = filteredExpenses.filter(
            expense => expense.categoria === datos.filtros!.categoria
          );
        }

        const total = filteredExpenses.reduce((sum, expense) => sum + expense.precio, 0);
        
        return {
          success: true,
          message: `Se encontraron ${filteredExpenses.length} gastos${datos.filtros?.categoria ? ` en categoría ${datos.filtros.categoria}` : ''} con un total de $${total.toFixed(2)}`,
          expenses: filteredExpenses,
          total,
          count: filteredExpenses.length,
        };

      case 'modificar':
        if (!datos.id) {
          return {
            success: false,
            message: "Para modificar un gasto necesitas proporcionar el ID",
          };
        }
        return await executeModificarGasto({
          id: datos.id,
          titulo: datos.titulo,
          precio: datos.precio,
          categoria: datos.categoria,
        });

      default:
        return {
          success: false,
          message: "Acción no válida. Usa: crear, obtener, o modificar",
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al gestionar el gasto",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Gestor principal de categorías
export const executeGestionarCategoria = async ({ accion, datos }: GestionarCategoriaInput): Promise<CategoriaResponse> => {
  try {
    // Validar acción
    if (!isValidCategoriaAccion(accion)) {
      return {
        success: false,
        message: `Acción no válida. Acciones permitidas: ${CATEGORIA_ACCIONES.join(', ')}`,
      };
    }

    switch (accion) {
      case 'crear':
        // Validar campos requeridos usando constantes
        const camposFaltantes = CAMPOS_REQUERIDOS_CREAR_CATEGORIA.filter(
          campo => !datos?.[campo as keyof typeof datos]
        );
        
        if (camposFaltantes.length > 0) {
          return {
            success: false,
            message: `Para crear una categoría necesitas: ${camposFaltantes.join(', ')}`,
          };
        }
        return await executeCrearCategoria({
          nombre: datos!.nombre!,
          color: datos!.color!,
          icono: datos!.icono!,
        });

      case 'obtener':
        return await executeObtenerCategorias();

      default:
        return {
          success: false,
          message: "Acción no válida. Usa: crear u obtener",
        };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al gestionar la categoría",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función para guardar un nuevo gasto
export const executeGuardarGasto = async ({
  titulo,
  precio,
  categoria,
}: GuardarGastoInput, userId: string): Promise<CrearGastoResponse> => {
  try {
    const expense: Expense = {
      id: nanoid(),
      user_id: userId,
      titulo,
      precio,
      categoria,
      fecha: new Date().toISOString(),
    };

    await saveExpense(expense);
    return {
      success: true,
      message: `Gasto "${titulo}" registrado exitosamente por $${precio.toFixed(
        2
      )} en la categoría ${categoria}`,
      expense,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al guardar el gasto",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función para obtener todos los gastos
export const executeObtenerGastos = async (): Promise<ObtenerGastosResponse> => {
  try {
    const expenses = await getExpenses();
    const total = expenses.reduce((sum, expense) => sum + expense.precio, 0);

    return {
      success: true,
      message: `Se encontraron ${expenses.length} gastos con un total de $${total.toFixed(
        2
      )}`,
      expenses,
      total,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener los gastos",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función para crear una nueva categoría
export const executeCrearCategoria = async ({
  nombre,
  color,
  icono,
}: CrearCategoriaInput): Promise<CrearCategoriaResponse> => {
  try {
    const category: Category = {
      id: nombre.toLowerCase().replace(/\s+/g, "-"),
      nombre,
      color,
      icono,
      fechaCreacion: new Date().toISOString(),
    };

    await saveCategory(category);
    return {
      success: true,
      message: `Categoría "${nombre}" creada exitosamente con icono ${icono}`,
      category,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al crear la categoría",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función para obtener todas las categorías
export const executeObtenerCategorias = async (): Promise<ObtenerCategoriasResponse> => {
  try {
    const categories = await getCategories();
    return {
      success: true,
      message: `Se encontraron ${categories.length} categorías disponibles`,
      categories,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al obtener las categorías",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función para modificar un gasto existente
export const executeModificarGasto = async ({
  id,
  titulo,
  precio,
  categoria,
}: ModificarGastoInput): Promise<ModificarGastoResponse> => {
  try {
    // Validar que el ID está presente (campo requerido)
    if (!id) {
      return {
        success: false,
        message: `Campo requerido faltante: ${CAMPOS_REQUERIDOS_MODIFICAR_GASTO.join(', ')}`,
      };
    }

    // Verificar que el gasto existe
    const existingExpense = await getExpenseById(id);
    if (!existingExpense) {
      return {
        success: false,
        message: `No se encontró ningún gasto con ID: ${id}`,
      };
    }

    // Verificar que se proporciona al menos un campo para actualizar
    const camposActualizacion = ['titulo', 'precio', 'categoria'] as const;
    const camposProporcionados = camposActualizacion.filter(campo => {
      const valor = { titulo, precio, categoria }[campo];
      return valor !== undefined && valor !== null && valor !== '';
    });

    if (camposProporcionados.length === 0) {
      return {
        success: false,
        message: `Debes proporcionar al menos uno de estos campos: ${camposActualizacion.join(', ')}`,
      };
    }

    // Actualizar el gasto
    const updatedExpense = await updateExpense(id, { titulo, precio, categoria });

    if (!updatedExpense) {
      return {
        success: false,
        message: "Error al actualizar el gasto",
      };
    }

    return {
      success: true,
      message: `Gasto "${existingExpense.titulo}" actualizado exitosamente`,
      originalExpense: existingExpense,
      updatedExpense,
    };
  } catch (error) {
    return {
      success: false,
      message: "Error al actualizar el gasto",
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
};

// Función auxiliar para validar si una descripción es clara o no
const isDescriptionUnclear = (description: string, ocrConfidence: number): boolean => {
  // Criterio 1: Descripción muy corta (< 5 caracteres)
  if (description.trim().length < 5) {
    return true;
  }

  // Criterio 2: Es el texto genérico/fallback
  if (description === "Gasto detectado en recibo") {
    return true;
  }

  // Criterio 3: Confianza OCR baja (< 75%)
  if (ocrConfidence < 75) {
    return true;
  }

  return false;
};

// Función auxiliar para extraer el monto de un texto OCR
const extractAmount = (text: string): number => {
  // Patrones para buscar montos (con varios formatos de moneda)
  const patterns = [
    // Patrones con palabras clave (TOTAL, Total, etc.)
    /(?:total|importe|suma|amount|precio|price|monto)[\s:]*\$?\s*([\d,.]+)/gi,
    /(?:total|importe|suma|amount|precio|price|monto)[\s:]*€?\s*([\d,.]+)/gi,
    // Patrones con símbolos de moneda
    /\$\s*([\d,.]+)/g,
    /€\s*([\d,.]+)/g,
    // Patrones de números con formato de precio (al final de línea)
    /([\d,.]+)/gm,
  ];

  const amounts: number[] = [];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const amountStr = match[1]?.replace(/[,.\s]/g, "") || match[0]?.replace(/[$€,.\s]/g, "");
      const amount = parseFloat(amountStr);
      if (!isNaN(amount) && amount > 0 && amount < 1000000) {
        amounts.push(amount);
      }
    }
  }

  // Retornar el monto más alto encontrado (usualmente es el total)
  return amounts.length > 0 ? Math.max(...amounts) : 0;
};

// Función auxiliar para extraer descripción del texto OCR
const extractDescription = (text: string): string => {
  // Tomar las primeras 2-3 líneas no vacías (nombre del establecimiento)
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  // Buscar líneas que parezcan nombres de establecimientos (no son solo números)
  const descriptionLines = lines
    .slice(0, 5)
    .filter((line) => !/^\d+$/.test(line) && !/^[\d\s\-:\/]+$/.test(line));

  const description = descriptionLines.slice(0, 2).join(" ");

  return description.substring(0, 50) || "Gasto detectado en recibo";
};

// Función auxiliar para inferir categoría del texto OCR
const inferCategory = (text: string): string => {
  const lowerText = text.toLowerCase();

  // Patrones de palabras clave por categoría
  const categoryPatterns: Record<string, string[]> = {
    alimentacion: [
      "restaurante",
      "restaurant",
      "comida",
      "café",
      "cafe",
      "bar",
      "pizza",
      "hamburguesa",
      "supermercado",
      "market",
      "tienda",
      "food",
      "cocina",
      "panaderia",
    ],
    transporte: [
      "gasolina",
      "gas",
      "uber",
      "taxi",
      "metro",
      "bus",
      "autobus",
      "transporte",
      "parking",
      "estacionamiento",
      "peaje",
      "combustible",
    ],
    entretenimiento: [
      "cine",
      "cinema",
      "teatro",
      "concierto",
      "museo",
      "parque",
      "juego",
      "game",
      "entretenimiento",
      "diversión",
    ],
    salud: [
      "farmacia",
      "pharmacy",
      "hospital",
      "médico",
      "doctor",
      "clinica",
      "salud",
      "health",
      "medicina",
      "consulta",
    ],
    educacion: [
      "escuela",
      "school",
      "universidad",
      "curso",
      "course",
      "libro",
      "book",
      "educación",
      "education",
      "academia",
    ],
    servicios: [
      "luz",
      "agua",
      "internet",
      "teléfono",
      "phone",
      "electricidad",
      "gas natural",
      "cable",
      "servicio",
      "service",
    ],
  };

  // Buscar coincidencias
  for (const [category, keywords] of Object.entries(categoryPatterns)) {
    if (keywords.some((keyword) => lowerText.includes(keyword))) {
      return category;
    }
  }

  return "otros"; // Categoría por defecto
};

// Función para procesar imagen de recibo con Tesseract.js OCR
export const executeProcesarImagenRecibo = async ({
  imagenBase64,
  mimeType,
}: ProcesarImagenReciboInput, userId: string) => {
  let worker;

  try {
    let base64Data: string;
    let imageMimeType: string;

    // Si la imagen viene como data URL completa, extraer base64 y mimeType
    if (imagenBase64.startsWith("data:")) {
      const match = imagenBase64.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        imageMimeType = match[1];
        base64Data = match[2];
      } else {
        throw new Error("Formato de data URL inválido");
      }
    } else {
      // Si viene como base64 puro, usar el mimeType proporcionado o asumir jpeg
      base64Data = imagenBase64;
      imageMimeType = mimeType || "image/jpeg";
    }

    // Crear worker de Tesseract con español e inglés para mejor detección
    worker = await createWorker(["spa", "eng"], 1, {
      logger: (m) => {
        // Log opcional para debugging
        if (m.status === "recognizing text") {
          console.log(`Tesseract progreso: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    // Construir data URL completa para Tesseract
    const imageDataUrl = `data:${imageMimeType};base64,${base64Data}`;

    // Realizar OCR en la imagen
    const {
      data: { text, confidence },
    } = await worker.recognize(imageDataUrl);

    console.log("Texto OCR extraído:", text);
    console.log("Confianza Tesseract:", confidence);

    // Terminar el worker
    await worker.terminate();

    if (!text || text.trim().length === 0) {
      throw new Error("No se pudo extraer texto de la imagen");
    }

    // Extraer información del texto usando parsing personalizado
    const amount = extractAmount(text);
    const description = extractDescription(text);
    const category = inferCategory(text);

    // Calcular nivel de confianza basado en Tesseract y si encontramos datos
    let confidenceLevel: "alto" | "medio" | "bajo";
    if (confidence > 80 && amount > 0) {
      confidenceLevel = "alto";
    } else if (confidence > 50 && amount > 0) {
      confidenceLevel = "medio";
    } else {
      confidenceLevel = "bajo";
    }

    // Validar y limpiar los datos
    const extractedData = {
      description: description,
      amount: amount,
      category: category,
      confidence: confidenceLevel,
      details: `OCR procesado con ${Math.round(confidence)}% de confianza`,
    };

    // Crear el gasto automáticamente usando la función saveExpense
    if (extractedData.amount > 0) {
      // Verificar si la descripción es clara o no
      const descriptionUnclear = isDescriptionUnclear(extractedData.description, confidence);

      if (descriptionUnclear) {
        // Descripción no clara: NO crear el gasto, solicitar aclaración al usuario
        const ocrData: ExtractedOcrData = {
          amount: extractedData.amount,
          category: extractedData.category,
          rawDescription: extractedData.description,
          confidence: confidence,
        };

        const result: OcrResult = {
          requiresClarification: true,
          extractedData: ocrData,
          message: `🔍 **Recibo procesado - Se requiere aclaración**

        📋 **Datos detectados:**
        - **Monto:** $${extractedData.amount.toFixed(2)}
        - **Categoría:** ${extractedData.category}
        - **Descripción detectada:** "${extractedData.description}"
        - **Confianza OCR:** ${Math.round(confidence)}%

        ⚠️ **El nombre del gasto no está claro.** Por favor, proporciona un nombre descriptivo para este gasto.

        _Nota: El gasto NO ha sido registrado aún. Una vez que proporciones el nombre, lo registraré automáticamente._`,
        };

        return result;
      } else {
        // Descripción clara: crear el gasto automáticamente (comportamiento actual)
        const expense: Expense = {
          id: nanoid(),
          user_id: userId,
          titulo: extractedData.description,
          precio: extractedData.amount,
          categoria: extractedData.category,
          fecha: new Date().toISOString(),
        };

        await saveExpense(expense);

        const result: OcrResult = {
          requiresClarification: false,
          expense: expense,
          message: `✅ **Recibo procesado y gasto registrado exitosamente**

        📋 **Datos extraídos:**
        - **Descripción:** ${extractedData.description}
        - **Precio:** $${extractedData.amount.toFixed(2)}
        - **Categoría:** ${extractedData.category}
        - **Confianza:** ${extractedData.confidence}

        💾 **Gasto registrado:**
        - **ID:** ${expense.id}
        - **Fecha:** ${expense.fecha}

        ${extractedData.details ? `ℹ️ **Detalles:** ${extractedData.details}` : ""}`,
        };

        return result;
      }
    } else {
      return {
        requiresClarification: false,
        message: `⚠️ **Recibo analizado pero no se pudo determinar el monto**

        📋 **Datos extraídos:**
        - **Descripción:** ${extractedData.description}
        - **Precio:** No detectado
        - **Categoría:** ${extractedData.category}
        - **Confianza:** ${extractedData.confidence}

        ${extractedData.details ? `ℹ️ **Detalles:** ${extractedData.details}` : ""}

        📝 **Texto extraído del recibo:**
        \`\`\`
        ${text.substring(0, 200)}${text.length > 200 ? "..." : ""}
        \`\`\`

        Por favor, proporciona manualmente el monto para registrar este gasto.`,
        extractedData,
      };
    }
  } catch (error) {
    // Asegurarse de terminar el worker si hubo error
    if (worker) {
      try {
        await worker.terminate();
      } catch (terminateError) {
        console.error("Error al terminar worker:", terminateError);
      }
    }

    console.error("Error processing receipt:", error);

    let errorMessage = "Error desconocido al procesar la imagen";

    if (error instanceof Error) {
      const errorStr = error.message.toLowerCase();

      if (errorStr.includes("language") || errorStr.includes("traineddata")) {
        errorMessage = `❌ **Error: No se pudo cargar el modelo de lenguaje OCR**

No se pudieron descargar los archivos de lenguaje necesarios para el OCR.

**Soluciones:**
1. Verifica tu conexión a internet
2. Intenta nuevamente en unos momentos
3. Registra el gasto manualmente usando el chat

Por favor, proporciona los datos del gasto manualmente o intenta más tarde.`;
      } else if (errorStr.includes("image") || errorStr.includes("formato")) {
        errorMessage = `❌ **Error: Formato de imagen inválido**

La imagen proporcionada no pudo ser procesada por el OCR.

**Soluciones:**
1. Asegúrate de que la imagen sea clara y legible
2. Intenta con otro formato de imagen (JPG, PNG)
3. Registra el gasto manualmente

Por favor, registra el gasto manualmente.`;
      } else {
        errorMessage = `❌ **Error al procesar el recibo con OCR**

${error.message}

Por favor, intenta nuevamente o registra el gasto manualmente.`;
      }
    }

    return {
      message: errorMessage,
    };
  }
};
