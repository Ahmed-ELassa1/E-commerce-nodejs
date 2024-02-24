import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import auth from "../../DB/middleware/auth.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import cartRolesEndPoints from "./cart.roles.endPoints.js";
import validation from "../../DB/middleware/validation.js";
import * as cartValidation from "./cart.validation.js";
import * as cartController from "./controller/cart.controller.js";
const router = Router();
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(cartRolesEndPoints.addToCart),
    validation(cartValidation.addcartSchema),
    asyncHandler(cartController.addToCart)
  )
  .patch(
    "/:productId",
    validation(tokenSchema, true),
    auth(cartRolesEndPoints.addToCart),
    validation(cartValidation.removeProductFromCartSchema),
    asyncHandler(cartController.removeProductFromCart)
  )
  .patch(
    "/",
    validation(tokenSchema, true),
    auth(cartRolesEndPoints.removeCart),
    asyncHandler(cartController.removeCart)
  );

export default router;
