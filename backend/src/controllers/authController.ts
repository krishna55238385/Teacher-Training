import { Request, Response } from "express";
import { AuthService } from "../services/authService.js";

const authService = new AuthService();

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (error: any) {
            res.status(401).json({ message: error.message });
        }
    }

    async getCurrentUser(req: Request, res: Response) {
        try {
            const userId = (req as any).user.id;
            // You could fetch more detailed info here if needed
            res.json({ id: userId, role: (req as any).user.role });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
