import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import auth from "../../DB/middleware/auth.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import orderRolesEndPoints from "./order.roles.endPoints.js";
import validation from "../../DB/middleware/validation.js";
import * as orderValidation from "./order.validation.js";
import * as orderController from "./controller/order.controller.js";
const router = Router();
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(orderRolesEndPoints.createOrder),
    validation(orderValidation.createOrderSchema),
    asyncHandler(orderController.createOrder)
  )
  .put(
    "/cancelOrder/:orderId",
    validation(tokenSchema, true),
    auth(orderRolesEndPoints.cancelOrder),
    validation(orderValidation.cancelOrderSchema),
    asyncHandler(orderController.cancelOrder)
  )
  .put(
    "/deliverOrder/:orderId",
    validation(tokenSchema, true),
    auth(orderRolesEndPoints.deliverdOrder),
    validation(orderValidation.deliverdOrderSchema),
    asyncHandler(orderController.deliverdOrder)
  )

export default router;
