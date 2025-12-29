import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AppDataSource } from "../config/database.js";
import { User } from "../entities/User.js";

dotenv.config();

const userRepository = AppDataSource.getRepository(User);

export const generateToken = (user: User) => {
    return jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || "secret",
        { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );
};

export class AuthService {
    async register(userData: Partial<User>) {
        const { email, password } = userData;

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password as string, 12);
        const user = userRepository.create({
            ...userData,
            password: hashedPassword,
        });

        await userRepository.save(user);

        // Remove password from returned object
        const { password: _, ...result } = user as any;
        return result;
    }

    async login(email: string, password: string) {
        const user = await userRepository.findOne({
            where: { email },
            select: ["id", "name", "email", "password", "role", "avatar"],
        });

        if (!user) {
            throw new Error("Invalid credentials");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }

        const token = generateToken(user);
        const { password: _, ...userWithoutPassword } = user;

        return { user: userWithoutPassword, token };
    }
}
