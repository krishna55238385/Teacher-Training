import { Request, Response } from "express";
import { AppDataSource } from "../config/database.js";
import { User, UserRole } from "../entities/User.js";

export class TeacherController {
    async getAllTeachers(req: Request, res: Response) {
        try {
            const userRepository = AppDataSource.getRepository(User);
            const teachers = await userRepository.find({
                where: { role: UserRole.TEACHER },
                relations: ["scenarioAttempts", "scenarioAttempts.scenario", "evaluation"],
                order: { name: "ASC" },
            });

            res.json(teachers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getTeacherDetails(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const userRepository = AppDataSource.getRepository(User);
            const teacher = await userRepository.findOne({
                where: { id, role: UserRole.TEACHER },
                relations: ["scenarioAttempts", "scenarioAttempts.scenario", "evaluation"],
            });

            if (!teacher) {
                return res.status(404).json({ message: "Teacher not found" });
            }

            res.json(teacher);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
