import { type RouterContext } from "../deps.ts";
import { IncomeService } from "../services/incomeService.ts";

export class IncomeController {
  // Create a new income entry
  static async createIncome({ request, response }: RouterContext<string>) {
    try {
      const body = await request.body().value;
      const { amount, category, description } = JSON.parse(body);

      if (!amount || !category || !description) {
        response.status = 400;
        response.body = {
          error: "Missing required fields (amount, category, description)",
        };
        return;
      }

      const newIncome = await IncomeService.createIncome({
        amount,
        category,
        description,
      });
      response.status = 201;
      response.body = newIncome;
    } catch (error) {
      console.error("Error adding income:", error);
      response.status = 500;
      response.body = { error: "Failed to add income" };
    }
  }

  // Retrieve all income entries
  static async getAllIncomes({ response }: RouterContext<string>) {
    try {
      const incomes = await IncomeService.getAllIncomes();
      response.status = 200;
      response.body = incomes;
    } catch (error) {
      console.error("Error fetching incomes:", error);
      response.status = 500;
      response.body = { error: "Failed to retrieve incomes" };
    }
  }

  // Retrieve a single income entry by ID
  static async getIncomeById({ response, params }: RouterContext<string>) {
    try {
      const { id } = params;
      const income = await IncomeService.getIncomeById(id);

      if (!income) {
        response.status = 404;
        response.body = { error: "Income not found" };
        return;
      }

      response.status = 200;
      response.body = income;
    } catch (error) {
      console.error("Error fetching income:", error);
      response.status = 500;
      response.body = { error: "Failed to retrieve income" };
    }
  }

  // Update an income entry by ID
  static async updateIncome({
    request,
    response,
    params,
  }: RouterContext<string>) {
    try {
      const { id } = params;
      const data = await request.body().value;

      const updatedIncome = await IncomeService.updateIncome(id, data);

      if (!updatedIncome) {
        response.status = 404;
        response.body = { error: "Income not found" };
        return;
      }

      response.status = 200;
      response.body = updatedIncome;
    } catch (error) {
      console.error("Error updating income:", error);
      response.status = 500;
      response.body = { error: "Failed to update income" };
    }
  }

  // Delete an income entry by ID
  static async deleteIncome({ response, params }: RouterContext<string>) {
    try {
      const { id } = params;
      const deleted = await IncomeService.deleteIncome(id);

      if (!deleted) {
        response.status = 404;
        response.body = { error: "Income not found" };
        return;
      }

      response.status = 204;
      response.body = { message: "Income deleted successfully" };
    } catch (error) {
      console.error("Error deleting income:", error);
      response.status = 500;
      response.body = { error: "Failed to delete income" };
    }
  }
}
