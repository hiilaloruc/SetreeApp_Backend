/*
GOAL RESPONSE
{       
  "title" : "Weekly"
  "count" : "6",
  "items" : [
    "Visit your granmda",
    "Go to a cinema with a friend",
    "Explore a new technology",
    "Call a random friend",
    "Get a certificate from any field",
    "Enroll a course - that you know nothing"
  ],
}
*/

import Collection from "../models/collectionModel.js";
import CollectionItem from "../models/collectionItemModel.js";

const createCollection = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.user;
    await Collection.create({
      title, //title = title,
      userId: id,
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
  //?status = inactive
  //?isPublic = true
  try {
    const isPublic = req.query.isPublic;
    const { id } = req.user;

    const filter = { userId: id, status: "active" };
    if (isPublic != null) filter.isPublic = isPublic;

    const collections = await Collection.find(filter, { __v: 0, _id: 0 });

    res.json({
      succeeded: true,
      collections,
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
    const { title, id } = req.body;
    const collections = await Collection.findOneAndUpdate({ id }, { title });

    res.json({
      succeded: true,
      message: "Collection updated successfully.",
      collections,
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
    const { status, id } = req.body;
    const collections = await Collection.findOneAndUpdate({ id }, { status });
    await CollectionItem.deleteMany({ collectionId: id });
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
    const collection = await Collection.findOne({ id: id }, { __v: 0, _id: 0 });
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

//if auth -> return success, if someone else's collection then check isPublic
const getCollectionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    let collection = await Collection.aggregate([
      { $match: { id: parseInt(id), status: "active" } },
      { $project: { _id: 0, __v: 0 } },
      {
        $lookup: {
          from: "collectionitems",
          foreignField: "collectionId",
          localField: "id",
          pipeline: [{ $project: { id: 1, content: 1, _id: 0 } }],
          as: "collection",
        },
      },
    ]);

    if (collection[0].isPublic === true || collection[0].userId === userId) {
      res.json({
        succeded: true,
        collections: collection[0],
      });
    } else {
      res.json({
        succeded: false,
        message: "Collection is not Found.",
        collection: null,
      });
    }
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
  getCollectionDetail,
};
