import { Schema, model, Types } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      min: [2, "min length 2 char"],
      max: [30, "max length 20 char"],
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      trim: true,
      lowercase: true,
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
      min: 1,
    },
    price: {
      type: Number,
      required: [true, "price is required"],
      min: 1,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
    },
    totalPrice: {
      type: Number,
      required: [true, "total price is required"],
      min: 1,
    },
    customId: {
      type: String,
      required: true,
    },
    description: String,
    colors: [String],
    size: [String],

    mainImage: {
      type: Object,
      required: [true, "main image is required"],
    },
    subImages: [
      {
        type: Object,
      },
    ],
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: [true, "subCategoryId is required"],
    },
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: [true, "brandId is required"],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const productModel = model("Product", productSchema);
export default productModel;
