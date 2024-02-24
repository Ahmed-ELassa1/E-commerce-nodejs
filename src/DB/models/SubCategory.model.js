import mongoose, { Schema, Types, model } from "mongoose";

const subCategorySchema = new Schema(
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
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId is required"],
    },
  },
  {
    timestamps: true,
  }
);
const subCategoryModel =
  mongoose.model.SubCategory || model("SubCategory", subCategorySchema);
export default subCategoryModel;
