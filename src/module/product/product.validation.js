import joi from "joi";
import generalFields from "../../utilis/generalFields.js";
import { validationId } from "../../DB/middleware/validation.js";

export const addProductSchema = joi
  .object({
    name: generalFields.name.min(2).max(30).required(),
    categoryId: generalFields._id,
    subCategoryId: generalFields._id,
    brandId: generalFields._id,
    stock: joi.number().positive().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().min(0).max(100),
    description: joi.string().min(5).max(500),
    colors: joi.array().items(joi.string().required()),
    size: joi.array().items(joi.string().required()),
    files: joi.object({
      mainImage: joi.array().items(generalFields.file).required(),
      subImages: joi.array().items(generalFields.file),
    }),
  })
  .required();
export const getOneProductSchema = joi.object({
  productId: generalFields._id,
});
export const UpdateProductSchema = joi
  .object({
    productId: generalFields._id,
    name: generalFields.name.min(2).max(30),
    categoryId: joi.string().custom(validationId),
    subCategoryId: joi.string().custom(validationId),
    brandId: joi.string().custom(validationId),
    stock: joi.number().positive().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().min(0).max(100),
    description: joi.string().min(5).max(500),
    colors: joi.array().items(joi.string().required()),
    size: joi.array().items(joi.string().required()),
    files: joi.object({
      mainImage: joi.array().items(generalFields.file),
      subImages: joi.array().items(generalFields.file),
    }),
  })
  .required();
