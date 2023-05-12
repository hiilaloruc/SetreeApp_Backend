import User from "../models/authModel.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const user = await User.findOne({ id: decoded.userId });

    if (!user) {
      res.status(401).send({ error: "User not found!" });
    }
    req.token = token;
    req.user = user;

    next();
  } catch (e) {
    // User not authenticated
    res.status(401).send({
      error: "Please authenticate. Log in and try again",
      message: e.message,
    });
  }
};
export { auth };
