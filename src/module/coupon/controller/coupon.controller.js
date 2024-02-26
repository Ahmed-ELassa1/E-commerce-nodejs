import couponModel from "../../../DB/models/Coupon.model.js";
import cloudinary from "../../../utilis/cloudinary.js";

export const addCoupon = async (req, res, next) => {
  const couponExist = await couponModel.findOne({ name: req.body.name });
  if (couponExist) {
    return next(new Error("name already exist", { cause: 409 }));
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/coupon` }
    );
    req.body.image = { public_id, secure_url };
  }
  req.body.createdBy = req.user._id;
  const newCoupon = await couponModel.create({ ...req.body });
  if (newCoupon) {
    return res
      .status(201)
      .json({ message: "coupon created successfully", coupon: newCoupon });
  }
};

export const getAllCoupons = async (req, res, next) => {
  const coupons = await couponModel.find();
  return res.status(200).json({ message: "done", coupons });
};

export const getOneCoupon = async (req, res, next) => {
  const coupon = await couponModel.findById({ _id: req.params.couponId });
  if (!coupon) {
    return next(new Error("coupon not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "done", coupon });
};

export const updateCoupon = async (req, res, next) => {
  const couponExist = await couponModel.findById({ _id: req.params.couponId });
  if (!couponExist) {
    return next(new Error("coupon not found", { cause: 409 }));
  }
  if (req.body.name) {
    const nameExist = await couponModel.findOne({ name: req.body.name });
    if (nameExist) {
      return next(new Error("name already exist", { cause: 409 }));
    }
  }
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/coupon` }
    );
    req.body.image = { public_id, secure_url };
    if (couponExist.image) {
      await cloudinary.uploader.destroy(couponExist.image.public_id);
    }
  }
  const newCoupon = await couponModel.findByIdAndUpdate(
    { _id: req.params.couponId },
    { ...req.body },
    { new: true }
  );
  if (newCoupon) {
    return res
      .status(200)
      .json({ message: "coupon Updated successfully", coupon: newCoupon });
  }
};
