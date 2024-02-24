import joi from "joi";
import { validationId } from "../DB/middleware/validation.js";

const generalFields = {
  authorization: joi.string().required(),
  name: joi.string().trim().messages({
    "string.empty": "name can't be empty",
    "any.required": "name is required field",
  }),
  _id: joi.string().custom(validationId).required(),
  id: joi.string().custom(validationId),
  email: joi
    .string()
    .email({ tlds: { allow: ["net", "com"] } })
    .required(),
  password: joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  file: joi.object({
    filename: joi.string().required(),
    originalname: joi.string().required(),
    encoding: joi.string().required(),
    mimetype: joi.string().required(),
    destination: joi.string().required(),
    fieldname: joi.string().required(),
    path: joi.string().required(),
    size: joi.number().positive().required(),
  }),
};
export default generalFields;
