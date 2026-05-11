import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../config/swagger.js";

const swaggerRoutes = express.Router();

// Serve Swagger UI
swaggerRoutes.use("/", swaggerUi.serve);
swaggerRoutes.get("/", swaggerUi.setup(swaggerSpec));

// Serve Swagger JSON
swaggerRoutes.get("/json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

export default swaggerRoutes;
