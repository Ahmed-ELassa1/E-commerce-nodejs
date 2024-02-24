import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import auth from "../../DB/middleware/auth.js";
import tokenSchema from "../../utilis/tokenValidation.js";
import couponRolesEndPoints from "./coupon.roles.endPoints.js";
import uploadFileCloud, {
  uploadedFileValidation,
} from "../../utilis/cloudinaryMulter.js";
import validation from "../../DB/middleware/validation.js";
import * as couponController from "./controller/coupon.controller.js";
import * as couponValidation from "./coupon.validation.js";

const router = Router();
router
  .post(
    "/",
    validation(tokenSchema, true),
    auth(couponRolesEndPoints.create),
    uploadFileCloud(uploadedFileValidation.image).single("image"),
    validation(couponValidation.addCouponSchema),
    asyncHandler(couponController.addCoupon)
  )
  .get("/", asyncHandler(couponController.getAllCoupons))
  .get(
    "/:couponId",
    validation(couponValidation.getOneCouponSchema),
    asyncHandler(couponController.getOneCoupon)
  )
  .put(
    "/:couponId",
    validation(tokenSchema, true),
    auth(couponRolesEndPoints.update),
    uploadFileCloud(uploadedFileValidation.image).single("image"),
    validation(couponValidation.updateCouponSchema),
    asyncHandler(couponController.updateCoupon)
  );
export default router;
