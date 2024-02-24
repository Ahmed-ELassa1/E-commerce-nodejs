import joi from "joi";
import generalFields from "../../utilis/generalFields.js";

export const signUpSchema = joi
  .object({
    userName: joi.string().min(2).max(20).required().messages({
      "string.empty": "name can't be empty",
      "any.required": "name is required field",
    }),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: joi.string().valid(joi.ref("password")).required(),
    phone: joi.string(),
    role: joi.string().valid("User", "Admin"),
    gender: joi.string().valid("male", "female"),
    age: joi.number(),
    confirmEmail: joi.boolean(),
    isDeleted: joi.boolean(),
    status: joi.string().valid("online", "offline"),
    wishList: joi.array(),
    image: joi.string(),
    address: joi.string(),
    DOB: joi.string(),
  })
  .required();

export const confirmEmailSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();
export const refreshTokenSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();
export const loginSchema = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
  })
  .required();
export const tokenSchema = joi
  .object({
    token: joi.string().required(),
  })
  .required();
export const sendCodeSchema = joi
  .object({
    email: generalFields.email,
  })
  .required();
export const forgetPasswordSchema = joi
  .object({
    email: generalFields.email,
    password: generalFields.password,
    cPassword: joi.string().valid(joi.ref("password")).required(),
    code: joi
      .string()
      .length(5)
      .pattern(new RegExp(/^\d{5}$/))
      .required(),
  })
  .required();
