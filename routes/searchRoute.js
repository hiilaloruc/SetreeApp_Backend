import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as searchController from "../controllers/searchController.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post("/search", searchController.searchUsersAndTags);
export default router;
