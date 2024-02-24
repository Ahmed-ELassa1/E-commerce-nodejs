import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const addBrandSchema = joi.object({
  name: generalFields.name.required(),
  file: generalFields.file.required(),
});
export const getOneBrandSchema = joi.object({
  brandId: generalFields._id,
});
export const updateBrandSchema = joi.object({
  name: generalFields.name,
  brandId: generalFields._id,
  file: generalFields.file,
});
