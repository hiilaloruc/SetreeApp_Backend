import Tag from "../models/tagModel.js";
import User from "../models/authModel.js";

const searchUsersAndTags = async (req, res) => {
  try {
    const { keyword } = req.body;
    const regex = new RegExp(keyword, "i");

    const users = await User.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { username: regex },
        { email: regex },
      ],
    });

    const tags = await Tag.find({ title: regex });

    const searchResults = {
      users,
      tags,
    };

    res.json({
      succeeded: true,
      searchResults,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

export { searchUsersAndTags };
