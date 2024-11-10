import { existsSync, ensureFileSync, loadEnv } from "../deps.ts";
import { Expense } from "../models/Expense.ts";
import { Income } from "../models/Income.ts";
import { encrypt, decrypt } from "../utils/crypto.ts";

const env = loadEnv();

const EXPENSE_DB_PATH = env.EXPENSE_DB_PATH;
const INCOME_DB_PATH = env.INCOME_DB_PATH;
const SECRET_KEY = env.SECRET_KEY || "my-secret-key"; // Secret key for AES encryption

// Ensure the database file exists, create it if not
const ensureDatabaseFileExists = (path: string) => {
  if (!existsSync(path)) {
    ensureFileSync(path); // Create the file if it doesn't exist
  }
};

// Read expenses data from the database file
export const readExpenses = async (): Promise<Expense[]> => {
  try {
    ensureDatabaseFileExists(EXPENSE_DB_PATH);

    if (!existsSync(EXPENSE_DB_PATH)) {
      return [];
    }

    const fileInfo = Deno.statSync(EXPENSE_DB_PATH);

    if (fileInfo.size === 0) {
      return [];
    }

    const data = await Deno.readFile(EXPENSE_DB_PATH);
    const decryptedData = await decrypt(data, SECRET_KEY);

    return JSON.parse(decryptedData);
  } catch (err) {
    console.error("Error reading the expenses database:", err);

    if (err instanceof Deno.errors.NotFound) {
      console.warn("Expenses database file not found, returning empty array.");
      return [];
    }

    return [];
  }
};

// Write expenses data to the database file
export const writeExpenses = async (expenses: Expense[]): Promise<void> => {
  try {
    ensureDatabaseFileExists(EXPENSE_DB_PATH);

    const jsonData = JSON.stringify(expenses);
    const encryptedData = await encrypt(jsonData, SECRET_KEY);

    await Deno.writeFile(EXPENSE_DB_PATH, encryptedData);
  } catch (err) {
    console.error("Error writing to the expenses database:", err);
  }
};

// Read income data from the database file
export const readIncome = async (): Promise<Income[]> => {
  try {
    ensureDatabaseFileExists(INCOME_DB_PATH);

    if (!existsSync(INCOME_DB_PATH)) {
      return [];
    }

    const fileInfo = Deno.statSync(INCOME_DB_PATH);

    if (fileInfo.size === 0) {
      return [];
    }

    const data = await Deno.readFile(INCOME_DB_PATH);
    const decryptedData = await decrypt(data, SECRET_KEY);

    return JSON.parse(decryptedData);
  } catch (err) {
    console.error("Error reading the income database:", err);

    if (err instanceof Deno.errors.NotFound) {
      console.warn("Income database file not found, returning empty array.");
      return [];
    }

    return [];
  }
};

// Write income data to the database file
export const writeIncome = async (income: Income[]): Promise<void> => {
  try {
    ensureDatabaseFileExists(INCOME_DB_PATH);

    const jsonData = JSON.stringify(income);
    const encryptedData = await encrypt(jsonData, SECRET_KEY);

    await Deno.writeFile(INCOME_DB_PATH, encryptedData);
  } catch (err) {
    console.error("Error writing to the income database:", err);
  }
};
