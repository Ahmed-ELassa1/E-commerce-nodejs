import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import auth from "../../DB/middleware/auth.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import uploadFileCloud, {
  uploadedFileValidation,
} from "../../utilis/cloudinaryMulter.js";
import * as subCategoryController from "./controller/subCategory.controller.js";
import validation from "../../DB/middleware/validation.js";
import {
  addSubCategorySchema,
  getAllSubCategoriesSchema,
  getOneSubCategorySchema,
  updateSubCategorySchema,
} from "./subCategory.validation.js";
import subCategoryRolesEndPoints from "./subCategory.roles.endPoints.js";
const router = Router({ mergeParams: true });
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(subCategoryRolesEndPoints.create),
    uploadFileCloud(uploadedFileValidation.image).single("image"),
    validation(addSubCategorySchema),
    asyncHandler(subCategoryController.addSubCategory)
  )
  .get(
    "/",
    validation(getAllSubCategoriesSchema),
    asyncHandler(subCategoryController.getAllSubCategories)
  )
  .get(
    "/:subCategoryId",
    validation(getOneSubCategorySchema),
    asyncHandler(subCategoryController.getOneSubCategory)
  );
router.put(
  "/:subCategoryId",
  validation(tokenSchema, true),
  auth(subCategoryRolesEndPoints.update),
  uploadFileCloud(uploadedFileValidation.image).single("image"),
  validation(updateSubCategorySchema),
  asyncHandler(subCategoryController.updateSubCategory)
);
export default router;
