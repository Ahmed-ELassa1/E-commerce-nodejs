import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import auth from "../../DB/middleware/auth.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import brandRolesEndPoints from "./brand.roles.endPoints.js";
import uploadFileCloud, {
  uploadedFileValidation,
} from "../../utilis/cloudinaryMulter.js";
import validation from "../../DB/middleware/validation.js";
import {
  addBrandSchema,
  getOneBrandSchema,
  updateBrandSchema,
} from "./brand.validation.js";
import * as brandController from "./controller/brand.controller.js";
const router = Router();
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(brandRolesEndPoints.create),
    uploadFileCloud(uploadedFileValidation.image).single("image"),
    validation(addBrandSchema),
    asyncHandler(brandController.addBrand)
  )
  .get("/", asyncHandler(brandController.getAllBrands))
  .get(
    "/:brandId",
    validation(getOneBrandSchema),
    asyncHandler(brandController.getOneBrand)
  );
router.put(
  "/:brandId",
  validation(tokenSchema, true),
  auth(brandRolesEndPoints.update),
  uploadFileCloud(uploadedFileValidation.image).single("image"),
  validation(updateBrandSchema),
  asyncHandler(brandController.updateBrand)
);
export default router;
