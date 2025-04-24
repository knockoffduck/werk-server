import { Hono } from "hono";
import { getAllWorkoutTemplates } from "../controllers/templates/templates.controller";
import templates from "./templates.routes";

const apiRoutes = new Hono();

apiRoutes.route("/templates", templates);

export default apiRoutes;
