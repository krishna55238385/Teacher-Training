import { Request, Response } from "express";
import { AppDataSource } from "../config/database.js";
import { Scenario } from "../entities/Scenario.js";
import { ScenarioAttempt, ScenarioStatus } from "../entities/ScenarioAttempt.js";
import { ToughTongueService } from "../services/toughTongueService.js";
import { LLMService } from "../services/llmService.js";

const toughTongueService = new ToughTongueService();
const llmService = new LLMService();

export class ScenarioController {
    async getScenarios(req: Request, res: Response) {
        try {
            const scenarioRepository = AppDataSource.getRepository(Scenario);
            const scenarios = await scenarioRepository.find();
            res.json(scenarios);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAccessToken(req: Request, res: Response) {
        try {
            const { scenarioId } = req.params;
            const result = await toughTongueService.getAccessToken(scenarioId);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async handleSessionSubmit(req: Request, res: Response) {
        try {
            const { sessionId, scenarioId } = req.body;
            const userId = (req as any).user.id;

            // 1. Fetch details from Tough Tongue
            const sessionDetails = await toughTongueService.getSessionDetails(sessionId);

            // 2. Update/Create ScenarioAttempt
            const attemptRepository = AppDataSource.getRepository(ScenarioAttempt);
            let attempt = await attemptRepository.findOneBy({ userId, scenarioId });

            if (!attempt) {
                attempt = attemptRepository.create({ userId, scenarioId });
            }

            attempt.status = ScenarioStatus.COMPLETED;
            attempt.toughTongueSessionId = sessionId;
            attempt.toughTongueData = sessionDetails;
            attempt.score = sessionDetails.evaluation_score || 0;
            attempt.feedback = sessionDetails.evaluation_note || "";

            await attemptRepository.save(attempt);

            // 3. Trigger overall evaluation if all 4 are done
            const overallResult = await llmService.generateOverallSummary(userId);

            res.json({
                message: "Session processed successfully",
                score: attempt.score,
                overallSummaryGenerated: !!overallResult
            });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
