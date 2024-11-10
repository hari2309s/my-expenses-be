import { Router } from "../deps.ts";
import { IncomeController } from "../controllers/incomeController.ts";

const incomeRouter = new Router();

incomeRouter
  .post("/income", IncomeController.createIncome)
  .get("/income", IncomeController.getAllIncomes)
  .get("/income/:id", IncomeController.getIncomeById)
  .put("/income/:id", IncomeController.updateIncome)
  .delete("/income/:id", IncomeController.deleteIncome);

export default incomeRouter;
