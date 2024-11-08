import { Context } from "../deps.ts";

export default async function errorHandler(
  ctx: Context,
  next: () => Promise<unknown>
) {
  try {
    await next();
  } catch (error) {
    console.error("Error:", error);
    ctx.response.status = 500;
    ctx.response.body = { error: "Internal Server Error" };
  }
}
