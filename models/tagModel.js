import mongoose from "mongoose";
import mongoose_autoinc from "mongoose-plugin-autoinc";

const { Schema } = mongoose;

const tagSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    collectionIds: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

tagSchema.plugin(mongoose_autoinc.autoIncrement, {
  model: "tags", //doc name on mongoose
  field: "id",
  startAt: 0,
  incrementBy: 1,
});

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;
