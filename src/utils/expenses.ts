import { createClient } from "@/lib/supabase/server";
import { Expense, Category } from "@/types/expense";

/**
 * Save a new expense to the database
 * The user_id must be included in the expense object
 * RLS will automatically ensure only the authenticated user can insert their own expenses
 */
export const saveExpense = async (expense: Expense): Promise<void> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('expenses')
      .insert({
        id: expense.id,
        user_id: expense.user_id,
        titulo: expense.titulo,
        precio: expense.precio,
        currency: expense.currency,
        categoria: expense.categoria,
        fecha: expense.fecha,
      });

    if (error) {
      console.error("Supabase error saving expense:", error);
      throw new Error("Error al guardar el gasto");
    }
  } catch (error) {
    console.error("Error saving expense:", error);
    throw new Error("Error al guardar el gasto");
  }
};

/**
 * Get all expenses for the authenticated user
 * RLS automatically filters to only return expenses where user_id = auth.uid()
 */
export const getExpenses = async (): Promise<Expense[]> => {
  try {
    const supabase = await createClient();

    // Debug: Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log("🔍 [getExpenses] Auth status:", {
      user: user ? { id: user.id, email: user.email } : null,
      authError: authError?.message
    });

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('fecha', { ascending: false });

    console.log("🔍 [getExpenses] Query result:", {
      dataCount: data?.length || 0,
      error: error?.message,
      errorCode: error?.code,
      errorDetails: error?.details,
      errorHint: error?.hint
    });

    if (error) {
      console.error("❌ Supabase error reading expenses:", error);
      throw new Error("Error al leer los gastos");
    }

    console.log("✅ [getExpenses] Success:", data?.length || 0, "expenses found");
    return data || [];
  } catch (error) {
    console.error("❌ Error reading expenses:", error);
    throw new Error("Error al leer los gastos");
  }
};

/**
 * Get a specific expense by ID
 * RLS ensures only the owner can access their expense
 */
export const getExpenseById = async (id: string): Promise<Expense | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null;
      }
      console.error("Supabase error getting expense by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting expense by ID:", error);
    return null;
  }
};

/**
 * Update an existing expense
 * RLS ensures only the owner can update their expense
 */
export const updateExpense = async (
  id: string,
  updates: Partial<Omit<Expense, 'id' | 'user_id' | 'created_at'>>
): Promise<Expense | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('expenses')
      .update({
        ...(updates.titulo && { titulo: updates.titulo }),
        ...(updates.precio !== undefined && { precio: updates.precio }),
        ...(updates.currency && { currency: updates.currency }),
        ...(updates.categoria && { categoria: updates.categoria }),
        ...(updates.fecha && { fecha: updates.fecha }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - either doesn't exist or not owned by user
        return null;
      }
      console.error("Supabase error updating expense:", error);
      throw new Error("Error al actualizar el gasto");
    }

    return data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Error al actualizar el gasto");
  }
};

/**
 * Get all categories (global, shared by all users)
 * RLS allows all authenticated users to read categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('nombre', { ascending: true });

    if (error) {
      console.error("Supabase error reading categories:", error);
      throw new Error("Error al leer las categorías");
    }

    return data || [];
  } catch (error) {
    console.error("Error reading categories:", error);
    throw new Error("Error al leer las categorías");
  }
};

/**
 * Get a specific category by ID
 */
export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error("Supabase error getting category by ID:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return null;
  }
};

/**
 * Save or update a category (admin only - not used by regular users)
 * Categories are global and seeded via SQL migration
 * This function is kept for backward compatibility but should rarely be used
 */
export const saveCategory = async (category: Category): Promise<void> => {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('categories')
      .upsert({
        id: category.id,
        nombre: category.nombre,
        color: category.color,
        icono: category.icono,
        fecha_creacion: category.fechaCreacion,
      });

    if (error) {
      console.error("Supabase error saving category:", error);
      throw new Error("Error al guardar la categoría");
    }
  } catch (error) {
    console.error("Error saving category:", error);
    throw new Error("Error al guardar la categoría");
  }
};
