import cartModel from "../../../DB/models/Cart.model.js";
import productModel from "../../../DB/models/Product.model.js";

export const addToCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  const productExist = await productModel.findOne({
    _id: productId,
    stock: { $gte: quantity },
  });
  if (!productExist) {
    return next(new Error("invalid product", { cause: 400 }));
  }
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    const cartCreaterd = await cartModel.create({
      userId: req.user._id,
      products: [{ productId, quantity }],
    });
    return res.status(201).json({ message: "done", cart: cartCreaterd });
  }
  let match = false;
  for (const product of cart.products) {
    if (product.productId == productId) {
      product.quantity = quantity;
      match = true;
      break;
    }
  }
  if (!match) {
    cart.products.push({ productId, quantity });
  }
  await cart.save();
  return res.status(200).json({ message: "done", cart });
};
export const removeProductFromCart = async (req, res, next) => {
  const { productId } = req.params;
  const productExist = await productModel.findOne({ _id: productId });
  if (!productExist) {
    return next(new Error("invalid product", { cause: 404 }));
  }
  const cart = await cartModel.findOne({
    userId: req.user._id,
    products: { $elemMatch: { productId: productId } },
  });
  if (!cart) {
    return next(new Error("cart not found", { cause: 404 }));
  }

  const updatedCart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: {
        products: { productId: productId },
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "product removed successfully", cart: updatedCart });
};
export const removeCart = async (req, res, next) => {
  const cart = await cartModel.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new Error("cart not found", { cause: 404 }));
  }
  const updatedCart = await cartModel.findOneAndUpdate(
    { userId: req.user._id },
    {
      products: [],
    },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "cart empty", cart: updatedCart });
};
