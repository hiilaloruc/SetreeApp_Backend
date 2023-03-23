import CollectionItem from "../models/collectionItemModel.js";

const createCollectionItem = async (req, res) => {
  try {
    const { content, collectionId } = req.body;
    const collectionItem = await CollectionItem.create({
      content,
      collectionId,
    });
    res.json({
      succeded: true,
      message: "CollectionItem created successfully.",
      collectionItem,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};
const getCollectionItem = async (req, res) => {
  try {
    const { id } = req.params;
    const collectionItem = await CollectionItem.findOne(
      { id },
      { __v: 0, _id: 0 }
    );
    res.json({
      succeded: true,
      collectionItem,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getItemsByCollection = async (req, res) => {
  try {
    const { collectionId } = req.params;
    console.log("req user: " + req.user);

    const collectionItems = await CollectionItem.find(
      { collectionId },
      { __v: 0, _id: 0 }
    );

    res.json({
      succeeded: true,
      collectionItems,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      message: error.message,
    });
  }
};

const updateCollectionItem = async (req, res) => {
  try {
    const { content, id } = req.body;
    const collectionItem = await CollectionItem.findOneAndUpdate(
      { id },
      { content }
    );

    res.json({
      succeded: true,
      message: "CollectionItem updated successfully.",
      collectionItem,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const deleteCollectionItem = async (req, res) => {
  try {
    const { id } = req.params;
    await CollectionItem.deleteOne({ id });

    res.json({
      succeded: true,
      message: "CollectionItem deleted!",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

export {
  deleteCollectionItem,
  updateCollectionItem,
  getItemsByCollection,
  createCollectionItem,
  getCollectionItem,
};
