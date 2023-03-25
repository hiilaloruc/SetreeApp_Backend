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

import Goal from "../models/goalModel.js";
//import GoalItem from "../models/goalItemModel.js";

const createGoal = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.user;
    await Goal.create({
      title, //title = title,
      userId: id,
    });
    res.json({
      succeded: true,
      message: "Goal created successfully.",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getGoals = async (req, res) => {
  try {
    const { id } = req.user;
    const filter = { userId: id, status: "active" };
    const goals = await Goal.find(filter, { __v: 0, _id: 0 });

    res.json({
      succeeded: true,
      goals: goals,
    });
  } catch (error) {
    res.json({
      succeeded: false,
      message: error.message,
    });
  }
};

const updateGoal = async (req, res) => {
  try {
    const { title, id } = req.body;
    const goal = await Goal.findOneAndUpdate({ id }, { title });

    res.json({
      succeded: true,
      message: "Goal updated successfully.",
      goal,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const { status, id } = req.body;
    const goals = await Goal.findOneAndUpdate({ id }, { status });

    res.json({
      succeded: true,
      message: "Goal is " + status + " now!",
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

const getGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findOne({ id: id }, { __v: 0, _id: 0 });
    res.json({
      succeded: true,
      goal,
    });
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};
const getGoalDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    let goal = await Goal.aggregate([
      { $match: { id: parseInt(id), status: "active" } },
      { $project: { _id: 0, __v: 0 } },
      {
        $lookup: {
          from: "goalitems",
          foreignField: "goalId",
          localField: "id",
          pipeline: [{ $project: { content: 1, isDone: 1, id: 1, _id: 0 } }],
          as: "goal",
        },
      },
    ]);

    if (goal[0].userId === userId) {
      res.json({
        succeded: true,
        goals: goal[0],
      });
    } else {
      res.json({
        succeded: false,
        message: "goal is not Found.",
        goal: null,
      });
    }
  } catch (error) {
    res.json({
      succeded: false,
      error,
    });
  }
};

export { createGoal, getGoals, updateGoal, deleteGoal, getGoal, getGoalDetail };
