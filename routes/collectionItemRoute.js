import express from "express";
import * as authMiddleware from "../middleware/authMiddleware.js";
import * as collectionItemController from "../controllers/collectionItemController.js";

const router = express.Router();

router.use(authMiddleware.auth);
router.post(
  "/createCollectionItem",
  collectionItemController.createCollectionItem
);
router.get(
  "/getCollectionItem/:id",
  collectionItemController.getCollectionItem
);
router.get(
  "/getItemsByCollection/:collectionId",
  collectionItemController.getItemsByCollection
); // GET ALL
router.post(
  "/updateCollectionItem",
  collectionItemController.updateCollectionItem
);

router.get(
  "/deleteCollectionItem/:id",
  collectionItemController.deleteCollectionItem
);

export default router;
