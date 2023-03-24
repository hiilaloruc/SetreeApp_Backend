import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as goalController from "../controllers/goalController.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post("/createGoal", goalController.createGoal);
router.get("/getGoals", goalController.getGoals);
router.get("/getGoal/:id", goalController.getGoal);
router.post("/updateGoal", goalController.updateGoal);
router.post("/deleteGoal", goalController.deleteGoal);

export default router;
