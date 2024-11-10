import { ExpenseModel } from "../models/Expense.ts";

export class ExpenseService {
  // Create a new expense entry
  static async createExpense(data: {
    amount: number;
    category: string;
    description: string;
  }) {
    return await ExpenseModel.create(data);
  }

  // Retrieve all expense entries
  static async getAllExpenses() {
    return await ExpenseModel.getAll();
  }

  // Retrieve a single expense entry by ID
  static async getExpenseById(id: string) {
    return await ExpenseModel.getById(id);
  }

  // Update an expense entry by ID
  static async updateExpense(
    id: string,
    data: { amount: number; category: string; description: string }
  ) {
    return await ExpenseModel.updateById(id, data);
  }

  // Delete an expense entry by ID
  static async deleteExpense(id: string) {
    return await ExpenseModel.deleteById(id);
  }
}
