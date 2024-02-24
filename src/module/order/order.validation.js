import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const createOrderSchema = joi
  .object({
    products: joi.array().items(
      joi.object({
        productId: generalFields._id,
        quantity: joi.number().positive().min(1).required(),
      })
    ),
    paymentType: joi.string().valid("card", "visa"),
    couponName: joi.string().trim().required(),
    note: joi.string().min(5).max(200),
    address: joi.string().min(10).max(100).required(),
    phone: joi
      .array()
      .items(
        joi.string().pattern(new RegExp("01[0-2,5]{1}[0-9]{8}")).required()
      )
      .required(),
  })
  .required();
export const cancelOrderSchema = joi
  .object({
    orderId: generalFields._id,
  })
  .required();
export const deliverdOrderSchema = joi
  .object({
    orderId: generalFields._id,
  })
  .required();
