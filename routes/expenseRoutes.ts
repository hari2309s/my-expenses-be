import { Router } from "../deps.ts";
import { ExpenseController } from "../controllers/expenseController.ts";

const expenseRouter = new Router();

expenseRouter
  .post("/expenses", ExpenseController.createExpense)
  .get("/expenses", ExpenseController.getAllExpenses)
  .get("/expenses/:id", ExpenseController.getExpenseById)
  .put("/expenses/:id", ExpenseController.updateExpense)
  .delete("/expenses/:id", ExpenseController.deleteExpense);

export default expenseRouter;
