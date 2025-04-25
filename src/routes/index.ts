import { Hono } from "hono";
import templates from "./templates.routes";
import exercises from "./exercises.routes";

const apiRoutes = new Hono();

apiRoutes.route("/templates", templates);
apiRoutes.route("/exercises", exercises);

export default apiRoutes;
