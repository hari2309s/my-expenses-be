import { Router } from "https://deno.land/x/oak/mod.ts";
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
expenseRoutes.post("/expenses", async (context) => {
  try {
    // Parse the incoming request body as JSON
    const body = await context.request.body().value;

    console.log("Received body:", body);

    // Check if the body contains required fields
    if (!body.amount || !body.category || !body.description) {
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
      amount: parseFloat(body.amount), // Ensure the amount is a number
      category: body.category,
      description: body.description,
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
expenseRoutes.get("/expenses", async (context) => {
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

export default expenseRoutes;
