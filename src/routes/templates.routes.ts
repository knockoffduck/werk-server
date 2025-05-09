import { Context, Hono } from "hono";
import { getWorkoutTemplates } from "./templates";
import { apiResponse } from "../utils/apiResponse";

const templates = new Hono();

templates.get("/workouts", async (ctx: Context) => {
  const result = await getWorkoutTemplates();
  return ctx.json(
    apiResponse(true, "Workout templates retrieved successfully", result),
  );
});

export default templates;
