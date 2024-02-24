import slugify from "slugify";
import brandModel from "../../../DB/models/Brand.model.js";
import cloudinary from "../../../utilis/cloudinary.js";

export const addBrand = async (req, res, next) => {
  if (!req.body.name) {
    return next(new Error("name is require", { cause: 400 }));
  }
  const brandExist = await brandModel.findOne({ name: req.body.name });
  if (brandExist) {
    return next(new Error("name already exist", { cause: 409 }));
  }
  if (!req.file) {
    return next(new Error("image is require", { cause: 400 }));
  }
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.APP_NAME}/brand` }
  );
  req.body.image = { public_id, secure_url };
  const slug = slugify(req.body.name);
  req.body.slug = slug;
  const newBrand = await brandModel.create({
    ...req.body,
  });
  if (newBrand) {
    return res.status(201).json({
      message: "brand created successfully",
      brand: newBrand,
    });
  }
};
export const getAllBrands = async (req, res, next) => {
  const brands = await brandModel.find();
  return res.status(200).json({
    message: "Done",
    brands,
  });
};
export const getOneBrand = async (req, res, next) => {
  const brand = await brandModel.findById({ _id: req.params.brandId });
  if (!brand) {
    return next(new Error("brand not found", { cause: 404 }));
  }
  return res.status(200).json({
    message: "Done",
    brand,
  });
};
export const updateBrand = async (req, res, next) => {
  const { name } = req.body;
  // 1 > check if brand exist
  const brand = await brandModel.findById({ _id: req.params.brandId });
  if (!brand) {
    return next(new Error("brand not found", { cause: 404 }));
  }
  // 2 > check if name already exist
  if (req.body.name) {
    const brandExist = await brandModel.findOne({
      name: req.body.name,
    });
    if (brandExist) {
      return next(new Error("name already exist", { cause: 409 }));
    }
    req.body.slug = slugify(name);
  }
  // 3 >  update Image
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { folder: `${process.env.APP_NAME}/brand` }
    );
    req.body.image = { public_id, secure_url };
    // 4 > delete prev image
    await cloudinary.uploader.destroy(brand.image.public_id);
  }
  // 5 > update brand
  const updatedBrand = await brandModel.findOneAndUpdate(
    { _id: req.params.brandId },
    req.body,
    { new: true }
  );
  if (updatedBrand) {
    return res.status(200).json({
      message: "brand updated successfully",
      brand: updatedBrand,
    });
  }
};
