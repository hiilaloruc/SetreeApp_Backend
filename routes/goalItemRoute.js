import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as goalItemController from "../controllers/goalItemController.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post("/createGoalItem", goalItemController.createGoalItem);
router.get("/getGoalItem/:id", goalItemController.getGoalItem);
router.get("/getItemsByGoal/:goalId", goalItemController.getItemsByGoal); // GET ALL
router.post("/updateGoalItem", goalItemController.updateGoalItem);
router.get("/deleteGoalItem/:id", goalItemController.deleteGoalItem);

export default router;
