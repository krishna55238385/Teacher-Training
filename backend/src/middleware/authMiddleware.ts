import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    id: string;
    role: string;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as JwtPayload;
        (req as any).user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user || (req as any).user.role !== "ADMIN") {
        return res.status(403).json({ message: "Access denied. Admin role required." });
    }
    next();
};
