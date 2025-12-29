import { Router } from "express";
import { ScenarioController } from "../controllers/scenarioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
const scenarioController = new ScenarioController();

router.get("/", authMiddleware, scenarioController.getScenarios);
router.get("/:scenarioId/token", authMiddleware, scenarioController.getAccessToken);
router.post("/submit", authMiddleware, scenarioController.handleSessionSubmit);

export default router;
