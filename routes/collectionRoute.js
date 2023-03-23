import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post("/createCollection", createCollection);
router.get("/getCollections", getCollections); // GET ALL
router.get("/getCollection/:id", getCollection);
router.get("/updateCollection/:id", updateCollection);
router.get("/deleteCollection/:id", deleteCollection);

export default router;
