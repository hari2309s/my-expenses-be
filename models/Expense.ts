import { ulid } from "../deps.ts";
import { readExpenses, writeExpenses } from "../db/dbOperations.ts";

export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
}

export class ExpenseModel {
  // Create a new expense
  static async create(data: {
    amount: number;
    category: string;
    description: string;
  }): Promise<Expense> {
    const newExpense: Expense = {
      id: ulid(),
      date: new Date().toISOString(),
      amount: data.amount,
      category: data.category,
      description: data.description,
    };

    const expenses = await readExpenses();
    expenses.push(newExpense);
    await writeExpenses(expenses);

    return newExpense;
  }

  // Get all expenses
  static async getAll(): Promise<Expense[]> {
    return await readExpenses();
  }

  // Get expense by ID
  static async getById(id: number): Promise<Expense | undefined> {
    const expenses = await readExpenses();
    return expenses.find((expense) => expense.id === id);
  }

  // Delete expense by ID
  static async deleteById(id: number): Promise<boolean> {
    const expenses = await readExpenses();
    const updatedExpenses = expenses.filter((expense) => expense.id !== id);
    const deleted = expenses.length !== updatedExpenses.length;
    if (deleted) await writeExpenses(updatedExpenses);
    return deleted;
  }

  // Update expense by ID
  static async updateById(
    id: number,
    data: Partial<Expense>
  ): Promise<Expense | null> {
    const expenses = await readExpenses();
    const index = expenses.findIndex((expense) => expense.id === id);

    if (index === -1) return null; // Expense not found

    // Update the existing expense with new data
    expenses[index] = { ...expenses[index], ...data };
    await writeExpenses(expenses);

    return expenses[index];
  }
}
