import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const addSubCategorySchema = joi.object({
  categoryId: generalFields._id,
  name: generalFields.name.required(),
  file: generalFields.file.required(),
});
export const getAllSubCategoriesSchema = joi.object({
  categoryId: generalFields._id,
});
export const getOneSubCategorySchema = joi.object({
  subCategoryId: generalFields._id,
  categoryId: generalFields._id,
});
export const updateSubCategorySchema = joi.object({
  name:generalFields.name,
  categoryId: generalFields._id,
  subCategoryId: generalFields._id,
  file: generalFields.file,
});
