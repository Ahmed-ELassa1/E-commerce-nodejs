import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "name is required"],
      min: [2, "min length 2 char"],
      max: [20, "max length 20 char"],
    },
    // slug: {
    //   type: String,
    //   required: [true, "slug is required"],
    // },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email already exit"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    gender: {
      type: String,
      // required: [true, "gender is required"],
      enum: ["male", "female"],
      default: "male",
    },
    age: {
      type: Number,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    wishList: [],
    image: String,
    address: String,
    DOB: String, // date of birth
    code: String,
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;
