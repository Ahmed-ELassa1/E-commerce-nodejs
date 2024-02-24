import mongoose, { Schema, Types, model } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      lowercase: true,
      trim: true,
    },
    image: {
      type: Object,
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
    usedBy: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: [false, "UserId is required"],
      },
    ],
    expireIn: {
      type: String,
      required: [true, "expiration date is required"],
    },
    amount: {
      type: Number,
      required: [true, "amount is required"],
      min: 1,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);
const couponModel = mongoose.model.couponModel || model("Coupon", couponSchema);
export default couponModel;
