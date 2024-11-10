import { type RouterContext } from "../deps.ts";
import { ExpenseService } from "../services/expenseService.ts";

export class ExpenseController {
  static async createExpense({ request, response }: RouterContext<string>) {
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

      const newExpense = await ExpenseService.createExpense({
        amount,
        category,
        description,
      });

      response.status = 201;
      response.body = newExpense;
    } catch (error) {
      console.error("Error adding expense:", error);
      response.status = 500;
      response.body = { error: "Failed to add expense" };
    }
  }

  static async getAllExpenses({ response }: RouterContext<string>) {
    try {
      const expenses = await ExpenseService.getAllExpenses();

      response.status = 200;
      response.body = expenses;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      response.status = 500;
      response.body = { error: "Failed to retrieve expenses" };
    }
  }

  static async getExpenseById({ response, params }: RouterContext<string>) {
    try {
      const { id } = params;

      const expense = await ExpenseService.getExpenseById(id);

      if (!expense) {
        response.status = 404;
        response.body = { error: "Expense not found" };
        return;
      }

      response.status = 200;
      response.body = expense;
    } catch (error) {
      console.error("Error fetching expense:", error);
      response.status = 500;
      response.body = { error: "Failed to retrieve expense" };
    }
  }

  static async updateExpense({
    request,
    response,
    params,
  }: RouterContext<string>) {
    try {
      const { id } = params;
      const data = await request.body().value;

      const updatedExpense = await ExpenseService.updateExpense(
        id,
        JSON.parse(data)
      );

      if (!updatedExpense) {
        response.status = 404;
        response.body = { error: "Expense not found" };
        return;
      }

      response.status = 200;
      response.body = updatedExpense;
    } catch (error) {
      console.error("Error updating expense:", error);
      response.status = 500;
      response.body = { error: "Failed to update expense" };
    }
  }

  static async deleteExpense({ response, params }: RouterContext<string>) {
    try {
      const { id } = params;

      const deleted = await ExpenseService.deleteExpense(id);

      if (!deleted) {
        response.status = 404;
        response.body = { error: "Expense not found" };
        return;
      }

      response.status = 204;
      response.body = { message: "Expense deleted successfully" };
    } catch (error) {
      console.error("Error deleting expense:", error);
      response.status = 500;
      response.body = { error: "Failed to delete expense" };
    }
  }
}
