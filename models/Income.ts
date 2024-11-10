import { ulid } from "../deps.ts";
import { readIncome, writeIncome } from "../db/dbOperations.ts";

export interface Income {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export class IncomeModel {
  static async create(data: {
    amount: number;
    category: string;
    description: string;
  }): Promise<Income> {
    const incomes = await readIncome();
    const newIncome: Income = {
      id: ulid(),
      ...data,
      date: new Date().toISOString(),
    };

    incomes.push(newIncome);

    await writeIncome(incomes);

    return newIncome;
  }

  static async getAll(): Promise<Income[]> {
    return await readIncome();
  }

  static async getById(id: string): Promise<Income | null> {
    const incomes = await readIncome();

    return incomes.find((income: Income) => income.id === id) || null;
  }

  static async updateById(
    id: string,
    data: Partial<Omit<Income, "id" | "date">>
  ): Promise<Income | null> {
    const incomes = await readIncome();
    const incomeIndex = incomes.findIndex((income: Income) => income.id === id);

    if (incomeIndex === -1) return null;

    incomes[incomeIndex] = { ...incomes[incomeIndex], ...data };
    await writeIncome(incomes);

    return incomes[incomeIndex];
  }

  static async deleteById(id: string): Promise<boolean> {
    const incomes = await readIncome();
    const newIncomes = incomes.filter((income: Income) => income.id !== id);

    if (newIncomes.length === incomes.length) return false;

    await writeIncome(newIncomes);

    return true;
  }
}
