import Tag from "../models/tagModel.js";
import User from "../models/authModel.js";
import Collection from "../models/collectionModel.js";

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

    const tags = await Tag.aggregate([
      { $match: { title: regex } },
      { $addFields: { collectionIdsCount: { $size: "$collectionIds" } } },
      { $sort: { collectionIdsCount: -1 } },
    ]);

    const usersWithListCount = await Promise.all(
      users.map(async (user) => {
        const publicCollectionsCount = await Collection.countDocuments({
          userId: user.id,
        });

        return {
          ...user.toJSON(),
          password: undefined,
          listCount: publicCollectionsCount,
        };
      })
    );

    const searchResults = {
      users: usersWithListCount,
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
