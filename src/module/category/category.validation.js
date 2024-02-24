import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const addCategorySchema = joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
});
export const getOneCategorySchema = joi.object({
  categoryId: generalFields._id,
});
export const updateCategorySchema = joi.object({
  name: generalFields.name,
  categoryId: generalFields._id,
  file: generalFields.file,
});
