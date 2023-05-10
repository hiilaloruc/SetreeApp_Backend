import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as collectionController from "../controllers/collectionController.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post("/createCollection", collectionController.createCollection);
router.get("/getCollections/:id", collectionController.getCollections);
router.get("/getCollection/:id", collectionController.getCollection);
router.post("/updateCollection", collectionController.updateCollection);
router.post("/deleteCollection", collectionController.deleteCollection);
router.get(
  "/getCollectionDetail/:id",
  collectionController.getCollectionDetail
);

export default router;
