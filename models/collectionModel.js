import mongoose from "mongoose";
import mongoose_autoinc from "mongoose-plugin-autoinc";

const { Schema } = mongoose;

const collectionSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Number,
    },
    imageUrl: {
      type: String,
      required: true,
      default:
        "https://images.pexels.com/photos/16719683/pexels-photo-16719683.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tag: {
      type: String,
    },
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

collectionSchema.plugin(mongoose_autoinc.autoIncrement, {
  model: "collections", //doc name on mongoose
  field: "id",
  startAt: 0,
  incrementBy: 1,
});

const Collection = mongoose.model("Collection", collectionSchema);
export default Collection;
