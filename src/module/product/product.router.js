import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import auth from "../../DB/middleware/auth.js";
import uploadFileCloud, {
  uploadedFileValidation,
} from "../../utilis/cloudinaryMulter.js";
import validation from "../../DB/middleware/validation.js";
import * as productValidation from "./product.validation.js";
import * as productController from "./controller/product.controller.js";
import productRolesEndPoints from "./protduct.roles.endPoints.js";
const router = Router();
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(productRolesEndPoints.create),
    uploadFileCloud(uploadedFileValidation.image).fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
      {
        name: "subImages",
        maxCount: 5,
      },
    ]),
    validation(productValidation.addProductSchema),
    asyncHandler(productController.addProduct)
  )
  .get("/", productController.getAllProducts)
  .get(
    "/:productId",
    validation(productValidation.getOneProductSchema),
    productController.getOneProduct
  )
  .put(
    "/:productId",
    validation(tokenSchema, true),
    auth(productRolesEndPoints.update),
    uploadFileCloud(uploadedFileValidation.image).fields([
      {
        name: "mainImage",
        maxCount: 1,
      },
      {
        name: "subImages",
        maxCount: 5,
      },
    ]),
    validation(productValidation.UpdateProductSchema),
    asyncHandler(productController.updateProduct)
  );
export default router;
