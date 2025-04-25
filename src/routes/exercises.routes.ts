import { Context, Hono } from "hono";
import { getWorkoutTemplates } from "./templates";
import { apiResponse } from "../utils/apiResponse";
import { getExercises } from "./exercises";

const exercises = new Hono();

exercises.get("/allExercises", async (ctx: Context) => {
  const result = await getExercises();
  return ctx.json(
    apiResponse(true, "Workout templates retrieved successfully", result),
  );
});

export default exercises;
