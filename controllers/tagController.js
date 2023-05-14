import Tag from "../models/tagModel.js";

const createTag = async (req, res) => {
  try {
    const { title, tagId } = req.body;
    const tag = await Tag.create({
      title,
      tagId,
    });
    res.json({
      succeded: true,
      message: "Tag created successfully.",
      tag,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findOne({ id }, { __v: 0, _id: 0 });
    res.json({
      succeded: true,
      tag,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await Tag.deleteOne({ id });

    res.json({
      succeded: true,
      message: "Tag deleted!",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

export { deleteTag, createTag, getTag };
