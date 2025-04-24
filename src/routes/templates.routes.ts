import { Hono } from "hono";
import { getAllWorkoutTemplates } from "../controllers/templates/templates.controller";

const templates = new Hono();

templates.get("/workouts", getAllWorkoutTemplates);

export default templates;
