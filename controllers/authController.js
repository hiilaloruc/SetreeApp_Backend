import User from "../models/authModel.js";
import Collection from "../models/collectionModel.js";
import CollectionItem from "../models/collectionItemModel.js";
import Goal from "../models/goalModel.js";
import GoalItem from "../models/goalItemModel.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//firstName*, lastName*,username*,email*,password*
const createUser = async (req, res) => {
  try {
    console.log("User Create Request Body: ", req.body);
    const user = await User.create(req.body);
    //const userToken = await jwt.sign({ id: user.id }, process.env.SECRET_JWT, {   expiresIn: "1h"});

    /* DEFAULT GOALS START */
    const goalsTitleArr = ["Daily", "Weekly", "Monthly"];

    const createdGoals = await Promise.all(
      goalsTitleArr.map(async (title) => {
        const goal = await Goal.create({
          title,
          userId: user.id,
        });

        let itemsForGoal;
        switch (title) {
          case "Daily":
            itemsForGoal = [
              "In morning, a 30-minute jog",
              "Call mom to ask about plant.",
              "Email Peter giving feedback",
              "Take the dog for a walk",
            ];
            break;
          case "Weekly":
            itemsForGoal = [
              "Read a chapter in a book",
              "Do yoga three times this week",
              "Find and cook a new and healthy recipe",
              "Make and live by a budget this week",
            ];
            break;
          case "Monthly":
            itemsForGoal = [
              "Go to concert at least 2 times",
              "Reduce time spent on social media during work hours.",
              "Catch up with an old friend",
            ];
            break;
          default:
            itemsForGoal = [];
        }

        const createdItems = await Promise.all(
          itemsForGoal.map(async (content) => {
            const goalItem = await GoalItem.create({
              content,
              goalId: goal.id,
            });
            return goalItem;
          })
        );

        return { goal, items: createdItems };
      })
    );

    /* DEFAULT GOALS END */
    /* DEFAULT COLLECTION START */
    const collectionsTitleArray = ["My Collection"];

    const createdCollections = await Promise.all(
      collectionsTitleArray.map(async (title) => {
        const collection = await Collection.create({
          title,
          userId: user.id,
          isPublic: false,
          imageUrl:
            "https://cdn.shopify.com/s/files/1/0091/2782/1371/files/DSC05023.jpg?v=1633442502",
        });

        let itemsForCollection;

        switch (title) {
          case "My Collection":
            itemsForCollection = [
              [
                "This is an example header",
                "You can write here any text you like..",
              ],
            ];
            break;
          default:
            itemsForCollection = [];
        }
        console.log("collection.id:", collection.id);
        const createdItems = await Promise.all(
          itemsForCollection.map(async (content) => {
            const collectionTitle = await CollectionItem.create({
              content: content[0],
              type: "title",
              collectionId: collection.id,
            });
            const collectionItem = await CollectionItem.create({
              content: content[1],
              type: "text",
              collectionId: collection.id,
            });

            return [collectionTitle, collectionItem];
          })
        );

        return { collection, items: createdItems };
      })
    );

    /* DEFAULT COLLECTION END */

    const userWithoutSensitiveData = {
      ...user.toJSON(),
      password: undefined,
      __v: undefined,
      _id: undefined,
    };
    res.json({
      succeeded: true,
      message: "User created successfully!",
      user: userWithoutSensitiveData,
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
    const user = await User.findOne({ email: email }, { __v: 0, _id: 0 });
    let same = false;

    if (!user) {
      return res.json({
        //return: because if no user exists why to check password ??
        succeeded: false,
        error: "No user found for this email.",
      });
    }
    same = await bcrypt.compare(password, user.password); //user.password is hashed version on db
    if (same) {
      const publicCollectionsCount = await Collection.countDocuments({
        userId: user.id,
      });

      const userModified = {
        ...user.toJSON(),
        password: undefined,
        listCount: publicCollectionsCount,
      };
      //successfully logged in
      const token = createToken(user.id);
      res.json({
        succeeded: true,
        user: userModified,
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

const updateProfileImage = async (req, res) => {
  try {
    const { newUrl } = req.body;
    const { id } = req.user;
    const user = await User.findOne({ id });
    user.imageUrl = newUrl;
    await user.save();

    const NewUser = await User.findOne({ id }, { __v: 0, _id: 0, password: 0 });
    const publicCollectionsCount = await Collection.countDocuments({
      userId: id,
    });
    const userModified = {
      ...NewUser.toJSON(),
      listCount: publicCollectionsCount,
    };

    res.json({
      succeeded: true,
      user: userModified,
    });
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
    const publicCollectionsCount = await Collection.countDocuments({
      userId: id,
    });
    const userModified = {
      ...user.toJSON(),
      listCount: publicCollectionsCount,
    };

    res.json({
      succeeded: true,
      user: userModified,
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

    const publicCollectionsCount = await Collection.countDocuments({
      userId: id,
      status: "active",
    });

    const userModified = {
      ...user.toJSON(),
      listCount: publicCollectionsCount,
    };

    res.json({
      succeeded: true,
      user: userModified,
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
    if (user.followers.includes(req.user.id)) {
      throw new Error("You already followed this user");
    }
    if (req.user.id === req.params.id) {
      throw new Error("You cannot follow yourself");
    }

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

const likeACollection = async (req, res) => {
  try {
    const collectionId = Number(req.params.id);
    let user = await User.findOne({ id: req.user.id });

    if (user.likedCollections.includes(collectionId)) {
      throw new Error("User already liked this collection");
    }

    user.likedCollections.push(collectionId);
    user.save();

    await Collection.updateOne(
      { id: collectionId },
      { $inc: { likeCount: 1 } }
    );

    res.json({
      succeeded: true,
      message: "Like successful.",
    });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const dislikeACollection = async (req, res) => {
  try {
    const collectionId = Number(req.params.id);
    let user = await User.findOne({ id: req.user.id });

    if (!user.likedCollections.includes(collectionId)) {
      throw new Error("User hasn't liked this collection yet.");
    }

    user.likedCollections.pull(collectionId);
    user.save();

    await Collection.updateOne(
      { id: collectionId },
      { $inc: { likeCount: -1 } }
    );

    res.json({
      succeeded: true,
      message: "Dislike successful.",
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
      { __v: 0, _id: 0, password: 0 }
    );

    const followerObjectsWithListCount = await Promise.all(
      followerObjects.map(async (following) => {
        const listCount = await Collection.countDocuments({
          userId: following.id,
        });
        return {
          ...following.toJSON(),
          listCount,
        };
      })
    );

    res.json({
      succeeded: true,
      followerObjects: followerObjectsWithListCount,
    });
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
      { __v: 0, _id: 0, password: 0 }
    );

    const followingObjectsWithListCount = await Promise.all(
      followingObjects.map(async (following) => {
        const listCount = await Collection.countDocuments({
          userId: following.id,
        });
        return {
          ...following.toJSON(),
          listCount,
        };
      })
    );

    res.json({
      succeeded: true,
      followingObjects: followingObjectsWithListCount,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      error: error.message,
    });
  }
};

const createToken = (userId) => {
  return jwt.sign({ userId }, process.env.SECRET_JWT, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
  likeACollection,
  dislikeACollection,
  updateProfileImage,
};
