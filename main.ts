import { Application, oakCors } from "./deps.ts";
import { loadEnv } from "./deps.ts"; // Import dotenv config function
import expenseRoutes from "./routes/expenseRoutes.ts";
import incomeRoutes from "./routes/incomeRoutes.ts";

// Load environment variables from the .env file
loadEnv();

const app = new Application();

app.use(oakCors());

// Use routes for handling requests
app.use(expenseRoutes.routes());
app.use(expenseRoutes.allowedMethods());
app.use(incomeRoutes.routes());
app.use(incomeRoutes.allowedMethods());

// Use the PORT from the environment variable, defaulting to 8000 if not specified
const PORT = Deno.env.get("PORT") || 8000;
console.log(`Server running on http://localhost:${PORT}`);
await app.listen({ port: +PORT });
