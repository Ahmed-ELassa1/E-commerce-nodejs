import mongoose, { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
  },
  {
    timestamps: true,
  }
);
// const cartModel = mongoose.model.Cart || model("Cart", cartSchema);
const cartModel = model("Cart", cartSchema);
export default cartModel;
