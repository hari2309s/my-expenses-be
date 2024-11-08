import {
  Expense,
  createExpense,
  getExpenses,
  deleteExpense as deleteExpenseModel,
} from "../models/expenseModel.ts";

export const getAllExpenses = (): Expense[] => {
  return getExpenses();
};

export const addExpense = (
  description: string,
  amount: number,
  category: string
): Expense => {
  return createExpense(description, amount, category);
};

export const deleteExpense = (id: number): boolean => {
  return deleteExpenseModel(id);
};
