import mongoose, { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      lowercase: true,
      trim: true,
    },
    image: {
      type: Object,
      required: [true, "image is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);
const brandModel = mongoose.model.Brand || model("Brand", brandSchema);
export default brandModel;
