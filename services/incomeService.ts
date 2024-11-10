import { IncomeModel } from "../models/Income.ts";

export class IncomeService {
  // Create a new income entry
  static async createIncome(data: {
    amount: number;
    category: string;
    description: string;
  }) {
    return await IncomeModel.create(data);
  }

  // Retrieve all income entries
  static async getAllIncomes() {
    return await IncomeModel.getAll();
  }

  // Retrieve a single income entry by ID
  static async getIncomeById(id: string) {
    return await IncomeModel.getById(id);
  }

  // Update an income entry by ID
  static async updateIncome(
    id: string,
    data: { amount?: number; category?: string; description?: string }
  ) {
    return await IncomeModel.updateById(id, data);
  }

  // Delete an income entry by ID
  static async deleteIncome(id: string) {
    return await IncomeModel.deleteById(id);
  }
}
