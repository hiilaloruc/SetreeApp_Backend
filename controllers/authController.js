import User from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//firstName*, lastName*,username*,email*,password*
const createUser = async (req, res) => {
  try {
    console.log("User Create Request Body: ", req.body);
    const user = await User.create(req.body);
    //const userToken = await jwt.sign({ id: user.id }, process.env.SECRET_JWT, {   expiresIn: "1h"});

    res.json({
      succeeded: true,
      message: "User created successfully!",
      user: user,
      //token: userToken,
    });
  } catch (error) {
    if (error.code === 11000) {
      // same email exists
      res.json({
        succeeded: false,
        message: "Email or username already exists",
      });
    } else {
      res.json({
        succeeded: false,
        message: error.message,
      });
    }
  }
};

const loginUser = async (req, res) => {
  try {
    console.log("User Login Request Body: ", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    let same = false;

    if (user) {
      same = await bcrypt.compare(password, user.password); //user.password is hashed version on db
    } else {
      return res.json({
        //return: because if no user exists why to check password ??
        succeeded: false,
        error: "No user found for this email.",
      });
    }

    if (same) {
      //successfully logged in

      const token = createToken(user.id);
      res.json({
        succeeded: true,
        user,
        token: token,
      });
    } else {
      //wrong password
      res.json({
        succeeded: false,
        error: "Invalid password..",
      });
    }
  } catch (error) {
    res.json({
      succeeded: false,
      error,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_JWT, {
    expiresIn: "1d",
  });
};

export { createUser, loginUser };
