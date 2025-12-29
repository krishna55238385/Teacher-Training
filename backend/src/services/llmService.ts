import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";
import { ScenarioAttempt, ScenarioStatus } from "../entities/ScenarioAttempt.js";
import { TeacherEvaluation } from "../entities/TeacherEvaluation.js";

export class LLMService {
    async generateOverallSummary(userId: string) {
        const attemptRepository = AppDataSource.getRepository(ScenarioAttempt);
        const evaluationRepository = AppDataSource.getRepository(TeacherEvaluation);
        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ id: userId });
        if (!user) throw new Error("User not found");

        const attempts = await attemptRepository.find({
            where: { userId, status: ScenarioStatus.COMPLETED },
            relations: ["scenario"],
        });

        if (attempts.length < 4) {
            console.log(`User ${userId} has only completed ${attempts.length} scenarios. Summary requires all 4.`);
            return null;
        }

        // Prepare data for LLM
        const performanceData = attempts.map(a => ({
            scenario: a.scenario.title,
            score: a.score,
            feedback: a.feedback,
            details: a.toughTongueData
        }));

        // Placeholder for actual LLM call
        // In a real implementation, you would send performanceData to Gemini/OpenAI
        const summary = `Overall Performance Summary for ${user.name}:
The teacher has successfully completed all 4 role-play scenarios. 
Average score: ${Math.round(attempts.reduce((acc, a) => acc + (a.score || 0), 0) / 4)}%.
Main strengths: Excellent communication in English and effective objection handling.
Areas for improvement: Focus more on "Sandwich Method" for feedback.`;

        let evaluation = await evaluationRepository.findOneBy({ userId });
        if (evaluation) {
            evaluation.llmSummary = summary;
        } else {
            evaluation = evaluationRepository.create({
                userId,
                llmSummary: summary,
            });
        }

        await evaluationRepository.save(evaluation);
        return evaluation;
    }
}
