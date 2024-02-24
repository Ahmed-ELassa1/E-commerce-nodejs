import slugify from "slugify";
import categoryModel from "../../../DB/models/Category.model.js";
import cloudinary from "../../../utilis/cloudinary.js";
import subCategoryModel from "../../../DB/models/SubCategory.model.js";

export const addSubCategory = async (req, res, next) => {
  const { name } = req.body;
  const categoryExist = await categoryModel.findById({
    _id: req.params.categoryId,
  });
  if (!categoryExist) {
    return next(new Error("category not found", { cause: 400 }));
  }
  if (!req.body.name) {
    return next(new Error("name is require", { cause: 400 }));
  }
  const subCategoryExist = await subCategoryModel.findOne({ name });
  if (subCategoryExist) {
    return next(new Error("name already exist", { cause: 409 }));
  }

  if (!req.file) {
    return next(new Error("image is require", { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.APP_NAME}/category/${req.params.categoryId}/subCategory`,
    }
  );
  req.body.image = { public_id, secure_url };
  req.body.slug = slugify(name);
  req.body.categoryId = req.params.categoryId;
  const newSubCategory = await subCategoryModel.create(req.body);
  if (newSubCategory) {
    return res.status(201).json({
      message: "subCategory created successfully",
      category: newSubCategory,
    });
  }
};

export const getAllSubCategories = async (req, res, next) => {
  const subCategories = await subCategoryModel
    .find({
      categoryId: req.params.categoryId,
    })
    .populate([
      {
        path: "categoryId",
      },
    ]);
  return res.status(200).json({
    message: "Done",
    subCategories,
  });
};
export const getOneSubCategory = async (req, res, next) => {
  const subCategory = await subCategoryModel
    .findById({ _id: req.params.subCategoryId })
    .populate([
      {
        path: "categoryId",
      },
    ]);
  if (!subCategory) {
    return next(new Error("subCategory not found", { cause: 404 }));
  }
  return res.status(200).json({
    message: "Done",
    subCategory,
  });
};
export const updateSubCategory = async (req, res, next) => {
  const subCategoryExist = await subCategoryModel.findById({
    _id: req.params.subCategoryId,
  });
  if (!subCategoryExist) {
    return next(new Error("subCategory not found", { cause: 404 }));
  }
  // 2 > check if name already exist
  if (req.body.name) {
    const subCategoryExist = await subCategoryModel.findOne({
      name: req.body.name,
    });
    if (subCategoryExist) {
      return next(new Error("name already exist", { cause: 409 }));
    }
    req.body.slug = slugify(req.body.name);
  }
  // 3 >  update Image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.APP_NAME}/category/${req.params.categoryId}/subCategory`,
      }
    );
    req.body.image = { public_id, secure_url };
    // 4 > delete prev image
    await cloudinary.uploader.destroy(subCategoryExist.image.public_id);
  }
  // 5 > update category
  const updatedSubCategory = await subCategoryModel.findOneAndUpdate(
    { _id: req.params.subCategoryId },
    req.body,
    { new: true }
  );
  if (updatedSubCategory) {
    return res.status(200).json({
      message: "subCategory updated successfully",
      subCategory: updatedSubCategory,
    });
  }
};
