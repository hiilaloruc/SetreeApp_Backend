import mongoose from "mongoose";
import mongoose_autoinc from "mongoose-plugin-autoinc";

const { Schema } = mongoose;

const goalSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

goalSchema.plugin(mongoose_autoinc.autoIncrement, {
  model: "goals", //doc name on mongoose
  field: "id",
  startAt: 0,
  incrementBy: 1,
});

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
