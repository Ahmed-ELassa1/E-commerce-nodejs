import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const addcartSchema = joi
  .object({
    productId: generalFields._id,
    quantity: joi.number().positive().min(1).required(),
  })
  .required();
export const removeProductFromCartSchema = joi
  .object({
    productId: generalFields._id,
  })
  .required();
