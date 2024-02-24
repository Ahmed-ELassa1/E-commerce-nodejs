import mongoose, { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
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
        name: {
          type: String,
          required: [true, "name is required"],
          min: [2, "min length 2 char"],
          max: [30, "max length 20 char"],
          trim: true,
          lowercase: true,
        },
        price: {
          type: Number,
          required: [true, "price is required"],
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: [true, "totalPrice is required"],
          min: 1,
        },
        notes: String,
        reason: String,
      },
    ],
    paymentType: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
    couponId: {
      type: Types.ObjectId,
      ref: "Coupon",
    },
    subPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: [
        "placed",
        "waitForPayment",
        "canceled",
        "onWay",
        "rejected",
        "deliverd",
      ],
      default: "placed",
    },
    address: {
      type: String,
      min: 10,
      max: 100,
      required: [true, "address is required"],
    },
    phone: [
      {
        type: String,
        required: [true, "phone is required"],
      },
    ],
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    note: {
      type: String,
      min: 5,
      max: 200,
    },
  },
  {
    timestamps: true,
  }
);
// const orderModel = mongoose.model.Order || model("Order", orderSchema);
const orderModel = model("Order", orderSchema);
export default orderModel;
