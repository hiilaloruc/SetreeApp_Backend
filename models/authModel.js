import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoose_autoinc from "mongoose-plugin-autoinc";

const { Schema } = mongoose;

//firstName*, lastName*,username*,email*,password*,gender,imageUrl,imageId,status,followers,followings
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 4,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    imageUrl: {
      type: String,
      required: true,
      default:
        "https://images.pexels.com/photos/2516000/pexels-photo-2516000.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    },
    imageId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    followers: [
      {
        type: Number,
      },
    ],
    followings: [
      {
        type: Number,
      },
    ],
  },
  {
    timestamps: true, //mongodb automatically adds createdAt and updatedAt
  }
);

userSchema.plugin(mongoose_autoinc.autoIncrement, {
  model: "users", //doc name on mongoose
  field: "id",
  startAt: 0,
  incrementBy: 1,
});

userSchema.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 12, (err, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model("User", userSchema);
export default User;
