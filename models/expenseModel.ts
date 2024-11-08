import { readExpenses, writeExpenses } from "../config/dbOperations.ts";

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
  date: string;
}

// Create a new expense and save it to the database
export const createExpense = async (
  description: string,
  amount: number,
  category: string
): Promise<Expense> => {
  const expenses = await readExpenses();
  const newExpense: Expense = {
    id: expenses.length + 1, // Assign a new id (or use a better strategy for unique IDs)
    description,
    amount,
    category,
    date: new Date().toISOString(),
  };

  expenses.push(newExpense);

  await writeExpenses(expenses); // Write updated expenses back to the encrypted file

  return newExpense;
};

// Get all expenses
export const getExpenses = async (): Promise<Expense[]> => {
  return await readExpenses(); // Fetch and return all expenses from the encrypted JSON
};

// Delete an expense by ID
export const deleteExpense = async (id: number): Promise<boolean> => {
  const expenses = await readExpenses();
  const index = expenses.findIndex((expense: Expense) => expense.id === id);

  if (index !== -1) {
    expenses.splice(index, 1); // Remove expense from array
    await writeExpenses(expenses); // Update the encrypted database file
    return true;
  }

  return false; // Return false if the expense was not found
};
