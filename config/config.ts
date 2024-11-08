import { loadEnv } from "../deps.ts";

const env = loadEnv();

export const PORT = parseInt(env.PORT) || 8000;
