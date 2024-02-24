import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import validation from "../../DB/middleware/validation.js";
import auth from "../../DB/middleware/auth.js";
import categoryRolesEndPoints from "./category.roles.endPoints.js";
import uploadFileCloud, {
  uploadedFileValidation,
} from "../../utilis/cloudinaryMulter.js";
import subCategoryRouter from "../subCategory/subCategory.router.js";
import {
  addCategorySchema,
  getOneCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";
import * as categoryController from "./controller/category.controller.js";
const router = Router();
router.use("/:categoryId/subCategory", subCategoryRouter);
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(categoryRolesEndPoints.create),
    uploadFileCloud(uploadedFileValidation.image).single("image"),
    validation(addCategorySchema),
    asyncHandler(categoryController.addCategory)
  )
  .get("/", asyncHandler(categoryController.getAllCategories))
  .get(
    "/:categoryId",
    validation(getOneCategorySchema),
    asyncHandler(categoryController.getOneCategory)
  );
router.put(
  "/:categoryId",
  validation(tokenSchema, true),
  auth(categoryRolesEndPoints.update),
  uploadFileCloud(uploadedFileValidation.image).single("image"),
  validation(updateCategorySchema),
  asyncHandler(categoryController.updateCategory)
);
export default router;
