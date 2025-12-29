import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import scenarioRoutes from "./routes/scenarioRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/scenarios", scenarioRoutes);
app.use("/api/teachers", teacherRoutes);

app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
});

// Database connection & Server start
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err: Error) => {
        console.error("Error during Data Source initialization", err);
    });
