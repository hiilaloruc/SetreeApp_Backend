import mongoose from "mongoose";
import mongoose_autoinc from "mongoose-plugin-autoinc";
const { Schema } = mongoose;

const goalItemSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      required: true,
      default: false,
    },
    goalId: {
      type: Number,
    },
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

goalItemSchema.plugin(mongoose_autoinc.autoIncrement, {
  model: "goalItems", //doc name on mongoose
  field: "id",
  startAt: 0,
  incrementBy: 1,
});

const GoalItem = mongoose.model("GoalItem", goalItemSchema);
export default GoalItem;
