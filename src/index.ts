import { Hono } from "hono";
import { cors } from "hono/cors";
import apiRoutes from "./routes";

const app = new Hono();

app.use(cors());

app.route("/api/v1", apiRoutes);

export default app;
