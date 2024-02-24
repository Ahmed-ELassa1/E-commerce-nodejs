import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const addCouponSchema = joi
  .object({
    name: generalFields.name.min(3).max(25).required(),
    file: generalFields.file,
    expireIn: joi.date().greater(new Date()).required(),
    amount: joi.number().min(1).max(100).positive().required(),
  })
  .required();
export const getOneCouponSchema = joi
  .object({
    couponId: generalFields._id,
  })
  .required();

export const updateCouponSchema = joi
  .object({
    couponId: generalFields._id,
    name: generalFields.name.min(3).max(25),
    file: generalFields.file,
    expireIn: joi.date().greater(new Date()),
    amount: joi.number().min(1).max(100).positive(),
  })
  .required();
