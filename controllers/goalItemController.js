import GoalItem from "../models/goalItemModel.js";

const createGoalItem = async (req, res) => {
  try {
    const { content, goalId } = req.body;
    const goalItem = await GoalItem.create({ content, goalId });
    res.json({
      succeded: true,
      message: "Goal Item created successfully.",
      goalItem,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};
const getGoalItem = async (req, res) => {
  try {
    const { id } = req.params;
    const goalItem = await GoalItem.findOne({ id }, { __v: 0, _id: 0 });
    res.json({
      succeded: true,
      goalItem,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getItemsByGoal = async (req, res) => {
  try {
    const { goalId } = req.params;

    const goalItems = await GoalItem.find({ goalId }, { __v: 0, _id: 0 });

    res.json({
      succeeded: true,
      goalItems,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      message: error.message,
    });
  }
};

const updateGoalItem = async (req, res) => {
  try {
    const { content, isDone, id } = req.body;
    const goalItem = await GoalItem.findOneAndUpdate(
      { id },
      { content, isDone }
    );
    res.json({
      succeded: true,
      message: "Goal Item updated successfully.",
      goalItem: {
        goalId: goalItem.goalId,
        content,
        isDone,
        id: goalItem.id,
        createdAt: goalItem.createdAt,
        updatedAt: goalItem.updatedAt,
      },
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const deleteGoalItem = async (req, res) => {
  try {
    const { id } = req.params;
    await GoalItem.deleteOne({ id });

    res.json({
      succeded: true,
      message: "GoalItem deleted!",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

export {
  deleteGoalItem,
  updateGoalItem,
  getItemsByGoal,
  createGoalItem,
  getGoalItem,
};
