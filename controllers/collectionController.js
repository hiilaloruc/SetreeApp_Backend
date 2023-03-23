import Collection from "../models/collectionModel.js";

const createCollection = async (req, res) => {
  try {
  } catch (error) {}
};

const getCollections = async (req, res) => {
  try {
    const { id } = req.user.id;
    console.log("req user: " + req.user);

    const collections = await Collection.find({ userId: id });

    res.json({
      succeeded: true,
      collectionsCount: collections.length,
      collections: collections,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      message: error.message,
    });
  }
};

export { getCollections };
