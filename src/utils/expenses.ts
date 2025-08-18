import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { Expense, Category } from "@/types/expense";

const expensesFilePath = join(process.cwd(), "data", "expenses.json");
const categoriesFilePath = join(process.cwd(), "data", "categories.json");

// Categorías predeterminadas
const defaultCategories: Category[] = [
  {
    id: "alimentacion",
    nombre: "Alimentación",
    color: "#ff6b6b",
    icono: "🍽️",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "transporte",
    nombre: "Transporte",
    color: "#4ecdc4",
    icono: "🚗",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "entretenimiento",
    nombre: "Entretenimiento",
    color: "#45b7d1",
    icono: "🎮",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "salud",
    nombre: "Salud",
    color: "#f9ca24",
    icono: "🏥",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "educacion",
    nombre: "Educación",
    color: "#6c5ce7",
    icono: "📚",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "servicios",
    nombre: "Servicios",
    color: "#a29bfe",
    icono: "⚡",
    fechaCreacion: new Date().toISOString(),
  },
  {
    id: "otros",
    nombre: "Otros",
    color: "#74b9ff",
    icono: "📦",
    fechaCreacion: new Date().toISOString(),
  },
];

export const saveExpense = (expense: Expense): void => {
  try {
    let expenses: Expense[] = [];
    
    if (existsSync(expensesFilePath)) {
      const data = readFileSync(expensesFilePath, "utf-8");
      expenses = JSON.parse(data);
    } else {
      const dir = join(process.cwd(), "data");
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }
    
    expenses.push(expense);
    writeFileSync(expensesFilePath, JSON.stringify(expenses, null, 2));
  } catch (error) {
    console.error("Error saving expense:", error);
    throw new Error("Error al guardar el gasto");
  }
};

export const getExpenses = (): Expense[] => {
  try {
    if (!existsSync(expensesFilePath)) {
      return [];
    }
    
    const data = readFileSync(expensesFilePath, "utf-8");
    const expenses = JSON.parse(data);
    
    return expenses.sort((a: Expense, b: Expense) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );
  } catch (error) {
    console.error("Error reading expenses:", error);
    throw new Error("Error al leer los gastos");
  }
};

// Funciones para categorías
export const saveCategory = (category: Category): void => {
  try {
    const categories: Category[] = getCategories();
    
    // Verificar si la categoría ya existe
    const existingIndex = categories.findIndex(cat => cat.id === category.id);
    if (existingIndex !== -1) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    const dir = join(process.cwd(), "data");
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    
    writeFileSync(categoriesFilePath, JSON.stringify(categories, null, 2));
  } catch (error) {
    console.error("Error saving category:", error);
    throw new Error("Error al guardar la categoría");
  }
};

export const getCategories = (): Category[] => {
  try {
    if (!existsSync(categoriesFilePath)) {
      // Si no existe el archivo, crear uno con las categorías predeterminadas
      const dir = join(process.cwd(), "data");
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      writeFileSync(categoriesFilePath, JSON.stringify(defaultCategories, null, 2));
      return defaultCategories;
    }
    
    const data = readFileSync(categoriesFilePath, "utf-8");
    const categories = JSON.parse(data);
    
    return categories.sort((a: Category, b: Category) => a.nombre.localeCompare(b.nombre));
  } catch (error) {
    console.error("Error reading categories:", error);
    throw new Error("Error al leer las categorías");
  }
};

export const getCategoryById = (id: string): Category | null => {
  try {
    const categories = getCategories();
    return categories.find(cat => cat.id === id) || null;
  } catch (error) {
    console.error("Error getting category by ID:", error);
    return null;
  }
};

export const updateExpense = (id: string, updates: Partial<Omit<Expense, 'id' | 'fecha'>>): Expense | null => {
  try {
    let expenses: Expense[] = [];
    
    if (existsSync(expensesFilePath)) {
      const data = readFileSync(expensesFilePath, "utf-8");
      expenses = JSON.parse(data);
    } else {
      throw new Error("No se encontró el archivo de gastos");
    }
    
    // Buscar el gasto por ID
    const expenseIndex = expenses.findIndex(expense => expense.id === id);
    if (expenseIndex === -1) {
      return null; // Gasto no encontrado
    }
    
    // Actualizar solo los campos proporcionados
    const updatedExpense = {
      ...expenses[expenseIndex],
      ...updates
    };
    
    expenses[expenseIndex] = updatedExpense;
    
    // Guardar los gastos actualizados
    writeFileSync(expensesFilePath, JSON.stringify(expenses, null, 2));
    
    return updatedExpense;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw new Error("Error al actualizar el gasto");
  }
};

export const getExpenseById = (id: string): Expense | null => {
  try {
    const expenses = getExpenses();
    return expenses.find(expense => expense.id === id) || null;
  } catch (error) {
    console.error("Error getting expense by ID:", error);
    return null;
  }
};
