import { Router } from "express";
import { TeacherController } from "../controllers/teacherController.js";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware.js";

const router = Router();
const teacherController = new TeacherController();

router.get("/", authMiddleware, adminMiddleware, teacherController.getAllTeachers);
router.get("/:id", authMiddleware, adminMiddleware, teacherController.getTeacherDetails);

export default router;
