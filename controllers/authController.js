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
    const user = await User.findOne(
      { email: email },
      { password: 0, __v: 0, _id: 0 }
    );

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
      error: error.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const { oldPassword, password } = req.body;
    const { id } = req.user;
    const same = await bcrypt.compare(oldPassword, req.user.password);
    if (same) {
      const user = await User.findOne({ id });
      user.password = password;
      await user.save();
      res.json({
        succeeded: true,
        message: "Password updated successfully",
      });
    } else {
      res.json({
        succeeded: false,
        message: "Old password does not match..",
      });
    }
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, username, email, gender } = req.body;
    const { id } = req.user;
    await User.findOneAndUpdate(
      { id },
      { firstName, lastName, username, email, gender }
    );
    const user = await User.findOne({ id }, { __v: 0, _id: 0, password: 0 });
    res.json({
      succeeded: true,
      user,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.query.id !== undefined ? req.query.id : req.user.id;

    const user = await User.findOne(
      { id: Number(id) },
      { _id: 0, __v: 0, password: 0 }
    );
    res.json({
      succeeded: true,
      user,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const follow = async (req, res) => {
  try {
    //update the one who I followed
    let user = await User.findOne({ id: Number(req.params.id) });
    user.followers.push(req.user.id);
    user.save();

    user = await User.findOne({ id: req.user.id });
    user.followings.push(Number(req.params.id));
    user.save();

    res.json({
      succeeded: true,
      message: "Follow successfull.",
    });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const unfollow = async (req, res) => {
  try {
    let user = await User.findOne({ id: Number(req.params.id) });
    user.followers.pull(req.user.id);
    user.save();

    user = await User.findOne({ id: req.user.id });
    user.followings.pull(Number(req.params.id));
    user.save();

    res.json({
      succeeded: true,
      message: "Unfollow successfull.",
    });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const getFollowers = async (req, res) => {
  try {
    const id = req.query.id !== undefined ? Number(req.query.id) : req.user.id;
    const user = await User.findOne({ id });
    const followers = user.followers;
    const followerObjects = await User.find(
      { id: { $in: followers } },
      { __v: 0, _id: 0, followers: 0, followings: 0, password: 0 }
    );

    res.json({ succeeded: true, followerObjects });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};
const getFollowings = async (req, res) => {
  try {
    const id = req.query.id !== undefined ? Number(req.query.id) : req.user.id;
    const user = await User.findOne({ id });
    const followings = user.followings;
    const followingObjects = await User.find(
      { id: { $in: followings } },
      { __v: 0, _id: 0, followers: 0, followings: 0, password: 0 }
    );
    res.json({ succeeded: true, followingObjects });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_JWT, {
    expiresIn: "1d",
  });
};

export {
  createUser,
  loginUser,
  updatePassword,
  updateUser,
  getUser,
  follow,
  unfollow,
  getFollowers,
  getFollowings,
};
