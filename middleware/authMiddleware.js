import User from "../models/authModel.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    // Try to find user
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const user = await User.findOne({ _id: decoded.userId });
    // If user not found, throw error
    if (!user) {
      res.status(401).send({ error: "user not found!" });
    }

    // Else, add user data and toke into request object
    req.token = token;
    req.user = user;

    // Keep going
    next();
  } catch (e) {
    // User not authenticated
    res.status(401).send({
      error: "Please authenticate.",
      message: e.message,
    });
  }
};
export { auth };
