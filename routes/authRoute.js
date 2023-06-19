import express from "express";
import * as authController from "../controllers/authController.js";
import * as authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to SETREE API. v:1.4 🚀" });
});

router.post("/register", authController.createUser);
router.post("/login", authController.loginUser);
router.post(
  "/updatePassword",
  authMiddleware.auth,
  authController.updatePassword
);
router.post(
  "/updateProfileImage",
  authMiddleware.auth,
  authController.updateProfileImage
);
router.post("/updateUser", authMiddleware.auth, authController.updateUser);
router.get("/getUser", authMiddleware.auth, authController.getUser);
router.get("/follow/:id", authMiddleware.auth, authController.follow);
router.get("/unfollow/:id", authMiddleware.auth, authController.unfollow);
router.get("/getFollowers", authMiddleware.auth, authController.getFollowers); // ?id=2  QUERY
router.get("/getFollowings", authMiddleware.auth, authController.getFollowings); // ?id=2  QUERY
router.get(
  "/likeACollection/:id",
  authMiddleware.auth,
  authController.likeACollection
);
router.get(
  "/dislikeACollection/:id",
  authMiddleware.auth,
  authController.dislikeACollection
);
export default router;
