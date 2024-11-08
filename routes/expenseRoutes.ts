import { Router, RouterContext } from "https://deno.land/x/oak/mod.ts";
import { writeExpenses, readExpenses } from "../config/dbOperations.ts";

// Initialize the router for expense routes
const expenseRoutes = new Router();

// Function to generate a unique ID for each expense
const generateExpenseId = (expenses: any[]): number => {
  // Generate an ID based on the highest existing ID, or default to 1 if empty
  const maxId = expenses.reduce((max, expense) => Math.max(max, expense.id), 0);
  return maxId + 1;
};

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

    // Get the current list of expenses
    const expenses = await readExpenses();

    // Generate a new expense object with automatic ID and current date
    const newExpense = {
      id: generateExpenseId(expenses), // Generate unique ID
      date: new Date().toISOString().split("T")[0], // Use the current date (YYYY-MM-DD format)
      amount: parseFloat(amount), // Ensure the amount is a number
      category: category,
      description: description,
    };

    // Add the new expense to the existing list
    expenses.push(newExpense);
    // Save the updated list of expenses to the encrypted file
    await writeExpenses(expenses);

    // Respond with success
    context.response.status = 201;
    context.response.body = { message: "Expense added successfully!" };
  } catch (error) {
    console.error("Error adding expense:", error);
    context.response.status = 500;
    context.response.body = {
      error: "An error occurred while adding the expense.",
    };
  }
});

// GET endpoint to retrieve all expenses
expenseRoutes.get("/expenses", async (context: RouterContext) => {
  try {
    const expenses = await readExpenses(); // Read expenses from the database
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

// Route for getting a single expense by ID
expenseRoutes.get("/expense/:id", async (context: RouterContext) => {
  try {
    const { id } = context.params; // Extract the 'id' parameter from the URL

    if (!id) {
      context.response.status = 400;
      context.response.body = { error: "Expense ID is required" };
      return;
    }

    const expenses = await readExpenses();
    const expense = expenses.find((exp) => exp.id === id);

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

// Route for deleting an expense by ID
expenseRoutes.delete("/expense/:id", async (context: RouterContext) => {
  try {
    const { id } = context.params; // Extract the 'id' parameter from the URL

    if (!id) {
      context.response.status = 400;
      context.response.body = { error: "Expense ID is required" };
      return;
    }

    const expenses = await readExpenses();
    const index = expenses.findIndex((exp) => exp.id === id);

    if (index !== -1) {
      // If the expense exists, remove it
      expenses.splice(index, 1);
      await writeExpenses(expenses); // Save the updated list back to the database
      context.response.status = 200;
      context.response.body = { message: "Expense deleted successfully!" };
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
