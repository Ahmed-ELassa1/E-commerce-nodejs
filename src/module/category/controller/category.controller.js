import slugify from "slugify";
import categoryModel from "../../../DB/models/Category.model.js";
import cloudinary from "../../../utilis/cloudinary.js";

export const addCategory = async (req, res, next) => {
  if (!req.body.name) {
    return next(new Error("name is require", { cause: 400 }));
  }
  const categoryExist = await categoryModel.findOne({ name: req.body.name });
  if (categoryExist) {
    return next(new Error("name already exist", { cause: 409 }));
  }
  if (!req.file) {
    return next(new Error("image is require", { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/category` }
  );
  req.body.image = { public_id, secure_url };
  const slug = slugify(req.body.name);
  req.body.slug = slug;
  req.body.createdBy = req.user._id;
  const newCategory = await categoryModel.create({
    ...req.body,
  });
  if (newCategory) {
    return res.status(201).json({
      message: "category created successfully",
      category: newCategory,
    });
  }
};
export const getAllCategories = async (req, res, next) => {
  const categories = await categoryModel.find().populate("subCategory");
  return res.status(200).json({
    message: "Done",
    categories,
  });
};
export const getOneCategory = async (req, res, next) => {
  const category = await categoryModel
    .findById({ _id: req.params.categoryId })
    .populate("subCategory");
  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }
  return res.status(200).json({
    message: "Done",
    category,
  });
};
export const updateCategory = async (req, res, next) => {
  const { name } = req.body;
  // 1 > check if category exist
  const category = await categoryModel.findById({ _id: req.params.categoryId });
  if (!category) {
    return next(new Error("category not found", { cause: 404 }));
  }
  // 2 > check if name already exist
  if (req.body.name) {
    const categoryExist = await categoryModel.findOne({
      name: req.body.name,
    });
    if (categoryExist) {
      return next(new Error("name already exist", { cause: 409 }));
    }
    req.body.slug = slugify(name);
  }
  // 3 >  update Image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/category` }
    );
    req.body.image = { public_id, secure_url };
    // 4 > delete prev image
    await cloudinary.uploader.destroy(category.image.public_id);
  }
  req.body.updatedBy = req.user._id;
  // 5 > update category
  const updatedCategory = await categoryModel.findOneAndUpdate(
    { _id: req.params.categoryId },
    req.body,
    { new: true }
  );
  if (updatedCategory) {
    return res.status(200).json({
      message: "category updated successfully",
      category: updatedCategory,
    });
  }
};
