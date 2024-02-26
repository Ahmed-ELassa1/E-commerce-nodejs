import cartModel from "../../../DB/models/Cart.model.js";
import couponModel from "../../../DB/models/Coupon.model.js";
import orderModel from "../../../DB/models/Order.model.js";
import productModel from "../../../DB/models/Product.model.js";
import sendEmail from "../../../utilis/email.js";
import createInvoice from "../../../utilis/generatePdf.js";
import fs from "fs";
import payment from "../../../utilis/payments.js";
import Stripe from "stripe";
import { fileURLToPath } from 'url'
import path, { dirname } from "path";
export const createOrder = async (req, res, next) => {
  let { products, couponName } = req.body;
  let discountAmount = 0;
  if (couponName) {
    const couponExist = await couponModel.findOne({
      name: couponName,
      usedBy: { $nin: req.user_id },
    });
    if (!couponExist) {
      return next(new Error(`coupon not found`, { cause: 404 }));
    }
    if (new Date(couponExist.expireIn) > new Date() == false) {
      return next(new Error(`coupon expired`, { cause: 400 }));
    }
    req.body.couponId = couponExist._id;
    discountAmount = couponExist.amount;
  }
  if (!products) {
    const cart = await cartModel.findOne({ userId: req.user._id });
    if (!cart || !cart?.products?.length) {
      return next(new Error(`cart not found`, { cause: 400 }));
    }
    products = cart.products.toObject();
  }
  let subPrice = 0;
  const allProducts = [];
  for (const product of products) {
    const productExist = await productModel.findOne({
      _id: product.productId,
      stock: { $gte: product.quantity },
    });
    if (!productExist) {
      return next(
        new Error(`product not found ${product.productId}`, { cause: 404 })
      );
    }
    product.name = productExist.name;
    product.price = productExist.totalPrice;
    product.totalPrice = +product.price * +product.quantity;
    subPrice += product.totalPrice;
    allProducts.push(product);
  }
  req.body.subPrice = subPrice;
  req.body.totalPrice = subPrice - (discountAmount * subPrice) / 100;
  req.body.products = allProducts;
  req.body.userId = req.user._id;
  req.body.paymentType == "cash"
    ? (req.body.status = "placed")
    : (req.body.status = "waitForPayment");

  const order = await orderModel.create(req.body);
  // handle reduce from  stock
  for (const product of products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: -parseInt(product?.quantity) } }
    );
    await cartModel.updateOne(
      { userId: req.user._id },
      { $pull: { products: { productId: product.productId } } }
    );
  }

  const invoice = {
    invoice_nr: order.id,
    subtotal: Number(order.subPrice),
    discount: Number(discountAmount) > 0 ? Number(discountAmount) : 0,
    currency: "EGP",
    orderDate: order.createdAt,
    shipping: {
      name: req.user.userName,
      address: order.address,
      city: "el marg",
      state: "Cairo",
      country: "Egypt",
    },
    items: order.products,
  };
  createInvoice(invoice, "invoice.pdf");
  if (couponName) {
    await couponModel.updateOne(
      { _id: req.body.couponId },
      { $push: { usedBy: req.user._id } }
    );
  }
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.resolve(__dirname, '..', '..', '..', '..', 'invoice.pdf');
  const file = fs.readFileSync(filePath)
  // const file = fs.readFileSync("../../../../invoice.pdf");
  await sendEmail({
    to: req.user.email,
    subject: "invoice",
    attachments: [
      {
        filename: "invoice.pdf",
        content: file,
      },
    ],
  });
  if (order?.paymentType == "visa") {
    const strip = new Stripe(process.env.PAYMENT_API_KEY);
    let stripCoupon = {};
    if (couponName) {
      stripCoupon = await strip.coupons.create({
        duration: "once",
        percent_off: discountAmount,
      });
    }
    const paymentItems = order.products.map((product) => {
      return {
        quantity: product.quantity,
        price_data: {
          currency: "usd",
          unit_amount: product.totalPrice * 100,
          product_data: {
            name: product.name,
          },
        },
      };
    });
    const sessionPayment = await payment({
      metadata: {
        orderId: order._id.toString(),
      },
      discounts: discountAmount
        ? [
          {
            coupon: stripCoupon?.id,
          },
        ]
        : [],
      success_url: `${process.env.SUCCESS_URL}/${order._id}`,
      cancel_url: `${process.env.CANCEL_URL}/${order._id}`,
      customer_email: req.user.email,
      line_items: paymentItems,
    });
    return res
      .status(200)
      .json({ message: "done", order: order, sessionPayment });
  }
  return res.status(200).json({ message: "done", order: order });
};

export const cancelOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const orderExist = await orderModel.findOne({
    _id: orderId,
    userId: req.user._id,
  });
  if (!orderExist) {
    return next(new Error(`order not found`, { cause: 404 }));
  }
  if (
    orderExist.status == "canceled" ||
    orderExist.status == "onWay" ||
    orderExist.status == "rejected" ||
    orderExist.status == "deliverd"
  ) {
    return next(new Error(`you can't cancel order`, { cause: 400 }));
  }
  // handle reduce from  stock
  for (const product of orderExist?.products) {
    await productModel.updateOne(
      { _id: product.productId },
      { $inc: { stock: parseInt(product?.quantity) } }
    );
  }
  if (orderExist?.couponId) {
    await couponModel.updateOne(
      { _id: orderExist.couponId },
      { $pull: { usedBy: req.user._id } }
    );
  }
  orderExist.status = "canceled";
  await orderExist.save();

  return res.status(200).json({ message: "done", order: orderExist });
};

export const deliverdOrder = async (req, res, next) => {
  const { orderId } = req.params;
  const orderExist = await orderModel.findById({ _id: orderId });
  if (!orderExist) {
    return next(new Error(`order not found`, { cause: 404 }));
  }
  if (orderExist.status != "onWay") {
    return next(new Error(`invalid deliver order`, { cause: 400 }));
  }
  orderExist.status = "deliverd";
  orderExist.updatedBy = req.user._id;
  await orderExist.save();
  return res.status(200).json({ message: "done", order: orderExist });
};

export const webhook = async (req, res, next) => {
  const stripe = new Stripe(process.env.PAYMENT_API_KEY);
  const endpointSecret = process.env.STRIP_ENDPOINT_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res, next.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  // Handle the event
  if (event.type == 'checkout.session.async_payment_succeeded') {
    const orderId = event.data.metadata.orderId
    const order = await orderModel.findByIdAndUpdate({
      _id: orderId,
    }, { status: "onWay" }, { new: true });
    return res.status(200).json({ message: "success payment", order })
  }

  return next(new Error("payment failed", { cause: 500 }))
}