import mongoose from "mongoose";
import mongoose_autoinc from "mongoose-plugin-autoinc";

const { Schema } = mongoose;

const collectionItemSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "title", "image"],
      required: true,
    },
    collectionId: {
      type: Number,
    },
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

collectionItemSchema.plugin(mongoose_autoinc.autoIncrement, {
  model: "collectionItems", //doc name on mongoose
  field: "id",
  startAt: 0,
  incrementBy: 1,
});

const CollectionItem = mongoose.model("CollectionItem", collectionItemSchema);
export default CollectionItem;
