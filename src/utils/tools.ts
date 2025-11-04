import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
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
export const executeGestionarGasto = async ({ accion, datos }: GestionarGastoInput): Promise<GastoResponse> => {
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
        });

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
}: GuardarGastoInput): Promise<CrearGastoResponse> => {
  try {
    const expense: Expense = {
      id: nanoid(),
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

// Función para procesar imagen de recibo
export const executeProcesarImagenRecibo = async ({
  imagenBase64,
  mimeType,
}: ProcesarImagenReciboInput) => {
  try {
    // Usar OpenAI Vision API para analizar la imagen
    const response = await generateText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza este recibo y extrae en JSON:
              {
                "description": "Producto/servicio (máx 50 chars)",
                "amount": "Precio como número",
                "category": "alimentacion|transporte|entretenimiento|salud|educacion|servicios|otros",
                "confidence": "alto|medio|bajo",
                "details": "Info adicional"
              }

              Solo JSON válido, sin texto extra.`,
            },
            {
              type: "image",
              image: `data:${mimeType};base64,${imagenBase64}`,
            },
          ],
        },
      ],
    });

    const content = response.text;

    if (!content) {
      throw new Error("No se pudo analizar la imagen");
    }

    // Intentar parsear el JSON de la respuesta
    let analysisResult;
    try {
      // Limpiar la respuesta en caso de que tenga texto adicional
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      // Respuesta de fallback si el parsing falla
      analysisResult = {
        description: "Gasto detectado en imagen",
        amount: 0,
        category: "otros",
        confidence: "bajo",
        details: "No se pudo analizar completamente la imagen",
      };
    }

    // Validar y limpiar los datos
    const extractedData = {
      description: String(analysisResult.description || "Gasto detectado").substring(
        0,
        50
      ),
      amount: parseFloat(analysisResult.amount) || 0,
      category: [
        "alimentacion",
        "transporte",
        "entretenimiento",
        "salud",
        "educacion",
        "servicios",
        "otros",
      ].includes(analysisResult.category)
        ? analysisResult.category
        : "otros",
      confidence: analysisResult.confidence || "medio",
      details: analysisResult.details || "Análisis completado",
    };

    // Crear el gasto automáticamente usando la función saveExpense
    if (extractedData.amount > 0) {
      const expense: Expense = {
        id: nanoid(),
        titulo: extractedData.description,
        precio: extractedData.amount,
        categoria: extractedData.category,
        fecha: new Date().toISOString(),
      };

      await saveExpense(expense);

      return {
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
        extractedData,
        expense,
      };
    } else {
      return {
        message: `⚠️ **Recibo analizado pero no se pudo determinar el monto**

        📋 **Datos extraídos:**
        - **Descripción:** ${extractedData.description}
        - **Precio:** No detectado
        - **Categoría:** ${extractedData.category}
        - **Confianza:** ${extractedData.confidence}

        ${extractedData.details ? `ℹ️ **Detalles:** ${extractedData.details}` : ""}

        Por favor, proporciona manualmente el monto para registrar este gasto.`,
        extractedData,
      };
    }
  } catch (error) {
    console.error("Error processing receipt:", error);
    return {
      message: `❌ **Error al procesar el recibo**

      ${error instanceof Error ? error.message : "Error desconocido"}

      Por favor, intenta nuevamente o registra el gasto manualmente.`,
    };
  }
};
