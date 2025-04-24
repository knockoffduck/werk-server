import { Context } from "hono";
import * as templateService from "../../services/templates/templates.service";
import { workoutTemplateSchema } from "../../models/templates.model";
import { apiResponse } from "../../utils/apiResponse";

export const getAllWorkoutTemplates = async (ctx: Context) => {
  const templates = await templateService.getWorkoutTemplates();
  return ctx.json(
    apiResponse(true, "Workouts fetched successfully", templates),
  );
};
