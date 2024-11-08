import { Context } from "../deps.ts";
import * as expenseService from "../services/expenseService.ts";

export const getExpenses = async (ctx: Context) => {
  const expenses = await expenseService.getAllExpenses();
  ctx.response.status = 200;
  ctx.response.body = { data: expenses };
};

export const createExpense = async (ctx: Context) => {
  const { description, amount, category } = await ctx.request.body().value;
  if (!description || !amount || !category) {
    ctx.response.status = 400;
    ctx.response.body = { error: "All fields are required." };
    return;
  }

  const newExpense = await expenseService.addExpense(
    description,
    amount,
    category
  );
  ctx.response.status = 201;
  ctx.response.body = { data: newExpense };
};

export const deleteExpense = async (ctx: Context) => {
  const id = parseInt(ctx.params.id);
  if (isNaN(id)) {
    ctx.response.status = 400;
    ctx.response.body = { error: "Invalid expense ID." };
    return;
  }

  const deleted = await expenseService.deleteExpense(id);
  if (deleted) {
    ctx.response.status = 200;
    ctx.response.body = { message: "Expense deleted successfully." };
  } else {
    ctx.response.status = 404;
    ctx.response.body = { error: "Expense not found." };
  }
};
