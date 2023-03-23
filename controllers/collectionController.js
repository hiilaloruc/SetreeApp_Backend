import Collection from "../models/collectionModel.js";

const createCollection = async (req, res) => {
  try {
    const { title } = req.body;
    const { _id } = req.user;
    await Collection.create({
      title, //title = title,
      user: _id,
    });
    res.json({
      succeded: true,
      message: "Collection created successfully.",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getCollections = async (req, res) => {
  try {
    const { _id } = req.user;
    console.log("req user: " + req.user);

    const collections = await Collection.find({ user: _id }, { __v: 0, id: 0 });

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

const updateCollection = async (req, res) => {
  try {
    const { title, _id } = req.body;
    const collections = await Collection.findOneAndUpdate({ _id }, { title });

    res.json({
      succeded: true,
      message: "Collection updated successfully.",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { status, _id } = req.body;
    const collections = await Collection.findOneAndUpdate({ _id }, { status });

    res.json({
      succeded: true,
      message: "Collection is " + status + " now!",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await Collection.findOne({ _id: id }, { __v: 0, id: 0 });

    res.json({
      succeded: true,
      collection,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

export {
  createCollection,
  getCollections,
  updateCollection,
  deleteCollection,
  getCollection,
};
