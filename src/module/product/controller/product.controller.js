import slugify from "slugify";
import brandModel from "../../../DB/models/Brand.model.js";
import categoryModel from "../../../DB/models/Category.model.js";
import productModel from "../../../DB/models/Product.model.js";
import subCategoryModel from "../../../DB/models/SubCategory.model.js";
import cloudinary from "../../../utilis/cloudinary.js";
import { nanoid } from "nanoid";
import ApiFeatures from "../../../utilis/apiFeatures.js";

export const addProduct = async (req, res, next) => {
  const { categoryId, subCategoryId, brandId } = req.body;
  if (!(await categoryModel.findOne({ _id: categoryId, isDeleted: false }))) {
    return next(new Error("invalid categoryId", { cause: 404 }));
  }
  if (
    !(await subCategoryModel.findOne({
      _id: subCategoryId,
      categoryId,
      isDeleted: false,
    }))
  ) {
    return next(new Error("invalid subCategoryId", { cause: 404 }));
  }
  if (!(await brandModel.findOne({ _id: brandId, isDeleted: false }))) {
    return next(new Error("invalid brandId", { cause: 404 }));
  }
  req.body.customId = nanoid();
  req.body.slug = slugify(req.body.name, {
    trim: true,
    lower: true,
  });
  if (!req.files?.mainImage) {
    return next(new Error("image is required", { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.mainImage[0].path,
    {
      folder: `${process.env.APP_NAME}/category/${categoryId}/subCategory/${subCategoryId}/product/${req.body.customId}/mainImage`,
    }
  );
  if (!public_id) {
    return next(new Error("image is required", { cause: 400 }));
  }
  req.body.mainImage = { public_id, secure_url };
  const images = [];
  if (req.files.subImages) {
    for (const img of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        img.path,
        {
          folder: `${process.env.APP_NAME}/category/${categoryId}/subCategory/${subCategoryId}/product/${req.body.customId}/subImages`,
        }
      );
      if (!public_id) {
        return next(new Error("subimage is required", { cause: 400 }));
      }
      images.push({ public_id, secure_url });
    }
    req.body.subImages = images;
  }
  req.body.totalPrice =
    req.body.price - (req.body.price * req.body.discount || 0) / 100;
  req.body.createdBy = req.user._id;
  const newProduct = await productModel.create(req.body);
  return res
    .status(201)
    .json({ message: "product created successfully", product: newProduct });
};
export const getAllProducts = async (req, res, next) => {
  const apiFeature = new ApiFeatures(productModel.find(), req.query)
    .paginate()
    .filter()
    .sort()
    .fields()
    .search();
  const products = await apiFeature.mongooseQuery;
  return res.status(200).json({ message: "done", products });
};
export const getOneProduct = async (req, res, next) => {
  const product = await productModel.findById({ _id: req.params.productId });
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "done", product });
};
// check if category exist
// check if subcategory exist
// check if brand exist
// make slug
// check if there is a discount
// upload main image
// check if there is sub image
// calc total price
export const updateProduct = async (req, res, next) => {
  const { categoryId, subCategoryId, brandId } = req.body;
  const existProduct = await productModel.findById({
    _id: req.params.productId,
  });
  if (!existProduct) {
    return next(new Error("invalid productId", { cause: 404 }));
  }
  if (
    categoryId &&
    !(await categoryModel.findOne({ _id: categoryId, isDeleted: false }))
  ) {
    return next(new Error("invalid categoryId", { cause: 404 }));
  }

  if (
    subCategoryId &&
    !(await subCategoryModel.findOne({
      _id: subCategoryId,
      categoryId,
      isDeleted: false,
    }))
  ) {
    return next(new Error("invalid subCategoryId", { cause: 404 }));
  }
  if (
    brandId &&
    !(await brandModel.findOne({ _id: brandId, isDeleted: false }))
  ) {
    return next(new Error("invalid brandId", { cause: 404 }));
  }
  if (req.body.name) {
    req.body.slug = slugify(req.body.name, {
      trim: true,
      lower: true,
    });
  }
  if (req.files?.mainImage?.length) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.files.mainImage[0].path,
      {
        folder: `${process.env.APP_NAME}/category/${
          categoryId || existProduct.categoryId
        }/subCategory/${subCategoryId || existProduct.subCategoryId}/product/${
          existProduct.customId
        }/mainImage`,
      }
    );
    if (!public_id) {
      return next(new Error("image is required", { cause: 400 }));
    }
    await cloudinary.uploader.destroy(existProduct.mainImage.public_id);
    req.body.mainImage = { public_id, secure_url };
  }
  const images = [];
  if (req.files?.subImages?.length) {
    for (const img of req.files.subImages) {
      const { public_id, secure_url } = await cloudinary.uploader.upload(
        img.path,
        {
          folder: `${process.env.APP_NAME}/category/${
            categoryId || existProduct.categoryId
          }/subCategory/${
            subCategoryId || existProduct.subCategoryId
          }/product/${existProduct.customId}/subImages`,
        }
      );
      if (!public_id) {
        return next(new Error("subimage is required", { cause: 400 }));
      }
      existProduct.subImages.push({ public_id, secure_url });
    }
    req.body.subImages = existProduct.subImages;
  }
  req.body.totalPrice =
    (req.body.price || existProduct.price) -
    ((req.body.price || existProduct.price) *
      (req.body.discount || existProduct.discount) || 0) /
      100;
  req.body.updatedBy = req.user._id;
  const updatedProduct = await productModel.findByIdAndUpdate(
    { _id: req.params.productId },
    req.body,
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "product updated successfully", product: updatedProduct });
};
