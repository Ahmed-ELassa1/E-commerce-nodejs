export const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return next(new Error(error, { cause: 500 }));
    });
  };
};
export const globerErrorHandling = (error, req, res, next) => {
  if (req.validationError) {
    return res
      .status(error?.cause || 500)
      .json({
        message: error?.message,
        validationError: req?.validationError?.details,
      });
  }
  if (process.env.MODE == "DEV") {
    return res
      .status(error?.cause || 500)
      .json({ message: error?.message, stack: error?.stack });
  }
  return res.status(error?.cause || 500).json({ message: error?.message });
};
