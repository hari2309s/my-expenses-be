import { loadEnv } from "../deps.ts";
import { encrypt, decrypt } from "../utils/crypto.ts";
import {
  existsSync,
  ensureFileSync,
} from "https://deno.land/std@0.224.0/fs/mod.ts";

const env = loadEnv();

const DB_PATH = env.DB_PATH; // Path to the encrypted JSON database file
const SECRET_KEY = env.SECRET_KEY || "my-secret-key"; // Secret key for AES encryption

// Ensure the database file exists, create it if not
const ensureDatabaseFileExists = () => {
  if (!existsSync(DB_PATH)) {
    ensureFileSync(DB_PATH); // Create the file if it doesn't exist
  }
};

// Read expenses from the encrypted JSON file
export const readExpenses = async (): Promise<any[]> => {
  try {
    ensureDatabaseFileExists();

    const fileInfo = Deno.statSync(DB_PATH); // Check file stats to determine if it has content

    // If the file is empty, just return an empty array
    if (fileInfo.size === 0) {
      return [];
    }

    const data = await Deno.readFile(DB_PATH); // Read the encrypted file as binary

    const decryptedData = await decrypt(data, SECRET_KEY); // Decrypt the data

    return JSON.parse(decryptedData); // Parse and return the decrypted data
  } catch (err) {
    console.error("Error reading the encrypted database:", err);
    if (err instanceof Deno.errors.NotFound) {
      console.warn("Database file not found, returning empty array.");
      return [];
    }
    return []; // Return an empty array if another error occurs
  }
};

// Write expenses to the encrypted JSON file
export const writeExpenses = async (expenses: any[]): Promise<void> => {
  try {
    ensureDatabaseFileExists(); // Ensure the file exists

    const expensesString = JSON.stringify(expenses); // Convert the expenses to JSON string

    const encryptedData = await encrypt(expensesString, SECRET_KEY); // Encrypt the data

    await Deno.writeFile(DB_PATH, encryptedData); // Write the encrypted binary data to the file
  } catch (err) {
    console.error("Error writing to the encrypted database:", err);
  }
};
