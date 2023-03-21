import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "welcome to API." });
});

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);

export default router;
