import Collection from "../models/collectionModel.js";
import Tag from "../models/tagModel.js";
import CollectionItem from "../models/collectionItemModel.js";

const createCollection = async (req, res) => {
  try {
    const { title, tagReq, isPublic, imageUrl } = req.body;
    const { id } = req.user;

    const image =
      imageUrl ||
      "https://images.pexels.com/photos/16719683/pexels-photo-16719683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    let newCollection = "";
    if (tagReq) {
      const tag = tagReq.toLowerCase();
      const existingTag = await Tag.findOne({ title: tag });

      newCollection = await Collection.create({
        title, //title = title,
        isPublic,
        userId: id,
        tag,
        imageUrl: image,
      });

      if (existingTag) {
        existingTag.collectionIds.push(newCollection.id);
        await existingTag.save();
      } else {
        const newTag = await Tag.create({
          title: tag,
        });

        newTag.collectionIds.push(newCollection.id);
        await newTag.save();
      }
    } else {
      newCollection = await Collection.create({
        title, //title = title,
        isPublic,
        userId: id,
        imageUrl: image,
      });
    }

    // _id ve __v parametrelerini gizleme
    newCollection._id = undefined;
    newCollection.__v = undefined;
    res.json({
      succeded: true,
      message: "Collection created successfully.",
      collection: newCollection,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getCollections = async (req, res) => {
  //if collections owner is the person that sent the request THEN: return all collections
  //but if collections owner is NOT the person that sent the request THEN: return only the collections that isPublic=true
  try {
    const { id } = req.params;
    const requestOwnerId = req.user.id;
    const filter = { userId: id, status: "active" };

    //id = collection owner id
    if (id != requestOwnerId) {
      filter.isPublic = true;
    }
    const collections = await Collection.find(filter, { __v: 0, _id: 0 })
      .sort({ createdAt: -1 })
      .exec();
    const collectionsWithCount = await Promise.all(
      collections.map(async (collection) => {
        const itemCount = await CollectionItem.countDocuments({
          collectionId: collection.id,
        });
        return {
          ...collection.toJSON(),
          itemCount,
        };
      })
    );

    res.json({
      succeeded: true,
      collections: collectionsWithCount,
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

    await Tag.updateMany(
      { collectionIds: { $in: [id] } },
      { $pull: { collectionIds: id } }
    );

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

    if (collection[0].userId !== userId) {
      // increase viewCount of collection
      await Collection.updateOne({ id }, { $inc: { viewCount: 1 } });
    }

    if (collection[0].isPublic === true || collection[0].userId === userId) {
      res.json({
        succeded: true,
        collections: collection[0],
      });
    } else {
      res.json({
        succeded: false,
        message: "You are not allowed to see that collection.",
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

const getCollectionsByTag = async (req, res) => {
  try {
    console.log("step 0");
    const { tag } = req.params;
    console.log("step 1");
    const collections = await Collection.find(
      { tag: tag, isPublic: true },
      { __v: 0, _id: 0 }
    );
    console.log("step 2");
    res.json({
      success: true,
      collections: collections,
    });
  } catch (error) {
    res.json({
      success: false,
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
  getCollectionsByTag,
};
