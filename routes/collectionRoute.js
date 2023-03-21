import express from "express";

const router = express.Router();

router.get("/getCollections", getCollections); // GET ALL
router.get("/getCollection/:id", getCollection);
router.get("/updateCollection/:id", updateCollection);
router.get("/deleteCollection/:id", deleteCollection);

export default router;
