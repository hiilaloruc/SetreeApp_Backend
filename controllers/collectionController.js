import Collection from "../models/collectionModel.js";

const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.status(201).json({
      succeeded: true,
      collections: collections,
    });
  } catch (error) {
    res.status(400).json({
      succeeded: false,
      message: error.message,
    });
  }
};
