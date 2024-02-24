import { Types } from "mongoose";

export const validationId = (value, helper) => {
  return Types.ObjectId.isValid(value)
    ? true
    : helper.message("Invalid id format");
};

const validation = (schema, containToken = false) => {
  return (req, res, next) => {
    const { authorization } = req.headers;
    let data = { ...req.body, ...req.params, ...req.query };
    // if (authorization) {
    //   data.authorization = authorization;
    // }
    if (req.file) {
      data.file = req.file;
    }
    if (req.files) {
      data.files = req.files;
    }
    if (req.headers?.authorization && containToken) {
      data = { authorization: req.headers.authorization };
    }
    const validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult?.error) {
      req.validationError = validationResult?.error;
      return next(new Error("catch validation error", { cause: 400 }));
    }
    next();
  };
};
export default validation;
