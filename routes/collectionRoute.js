import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as collectionController from "../controllers/collectionController.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post("/createCollection", collectionController.createCollection);
router.get("/getCollections", collectionController.getCollections); // GET ALL
router.get("/getCollection/:id", collectionController.getCollection);
router.post("/updateCollection", collectionController.updateCollection);
router.post("/deleteCollection", collectionController.deleteCollection);

export default router;
