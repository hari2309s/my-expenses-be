import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { ExpenseModel } from "../models/Expense.ts";

// Initialize the router for expense routes
const expenseRoutes = new Router();

// GET endpoint to retrieve all expenses
expenseRoutes.get("/expenses", async (context: RouterContext) => {
  try {
    const expenses = await ExpenseModel.getAll();
    context.response.status = 200;
    context.response.body = expenses; // Return the list of expenses
  } catch (error) {
    console.error("Error retrieving expenses:", error);
    context.response.status = 500;
    context.response.body = {
      error: "An error occurred while retrieving expenses.",
    };
  }
});

// POST endpoint to add a new expense
expenseRoutes.post("/expenses", async (context: RouterContext) => {
  try {
    // Parse the incoming request body as JSON
    const body = await context.request.body().value;

    const { amount, category, description } = JSON.parse(body);

    // Check if the body contains required fields
    if (!amount || !category || !description) {
      context.response.status = 400;
      context.response.body = {
        error: "Missing required fields (amount, category, description)",
      };
      return;
    }

    const newExpense = await ExpenseModel.create({
      amount,
      category,
      description,
    });

    context.response.status = 201;
    context.response.body = {
      message: "Expense added successfully!",
      expense: newExpense,
    };
  } catch (error) {
    console.error("Error adding expense:", error);
    context.response.status = 500;
    context.response.body = {
      error: "An error occurred while adding the expense.",
    };
  }
});

// Route for getting a single expense by ID
expenseRoutes.get("/expense/:id", async (context: RouterContext) => {
  try {
    const { id } = context.params; // Extract the 'id' parameter from the URL

    if (!id) {
      context.response.status = 400;
      context.response.body = { error: "Expense ID is required" };
      return;
    }

    const expense = await ExpenseModel.getById(+id);

    if (expense) {
      context.response.status = 200;
      context.response.body = expense; // Return the expense
    } else {
      context.response.status = 404;
      context.response.body = { error: "Expense not found" };
    }
  } catch (error) {
    console.error("Error fetching expense by ID:", error);
    context.response.status = 500;
    context.response.body = {
      error: "An error occurred while fetching the expense.",
    };
  }
});

// Route for editing an expense by ID
expenseRoutes.put("/expense/:id", async (context: RouterContext) => {
  try {
    const { id } = context.params; // Extract the 'id' parameter from the URL
    const body = await context.request.body().value;

    const { amount, category, description } = JSON.parse(body);

    // Ensure the required fields are provided
    if (!amount || !category || !description) {
      context.response.status = 400;
      context.response.body = {
        error: "Missing required fields (amount, category, description)",
      };
      return;
    }

    const updatedExpense = await ExpenseModel.updateById(+id, {
      amount,
      category,
      description,
    });

    if (updatedExpense) {
      context.response.status = 200;
      context.response.body = {
        message: "Expense updated successfully!",
        expense: updatedExpense,
      };
    } else {
      context.response.status = 404;
      context.response.body = { error: "Expense not found" };
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    context.response.status = 500;
    context.response.body = {
      error: "An error occurred while updating the expense.",
    };
  }
});

// Route for deleting an expense by ID
expenseRoutes.delete("/expense/:id", async (context: RouterContext) => {
  try {
    const { id } = context.params; // Extract the 'id' parameter from the URL

    if (!id) {
      context.response.status = 400;
      context.response.body = { error: "Expense ID is required" };
      return;
    }

    const deleted = await ExpenseModel.deleteById(+id);

    if (deleted) {
      context.response.status = 200;
      context.response.body = { message: "Expense deleted successfully" };
    } else {
      context.response.status = 404;
      context.response.body = { error: "Expense not found" };
    }
  } catch (error) {
    console.error("Error deleting expense:", error);
    context.response.status = 500;
    context.response.body = {
      error: "An error occurred while deleting the expense.",
    };
  }
});

export default expenseRoutes;
