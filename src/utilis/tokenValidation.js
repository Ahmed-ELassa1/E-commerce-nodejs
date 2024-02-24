import joi from "joi";

const tokenSchema = joi
  .object({
    authorization: joi.string().required(),
  })
  .required();
export default tokenSchema;