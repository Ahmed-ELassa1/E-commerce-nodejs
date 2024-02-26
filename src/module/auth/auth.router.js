import { Router } from "express";
import { asyncHandler } from "../../utilis/asyncHandler.js";
import validation from "../../DB/middleware/validation.js";
import * as authController from "./controller/auth.controller.js";
import * as authValidation from "./auth.validation.js";
const router = Router();
router
  .post(
    "/signUp",
    validation(authValidation.signUpSchema),
    asyncHandler(authController.signUp)
  )
  .get(
    "/confirmEmail/:token",
    validation(authValidation.confirmEmailSchema),
    authController.confirmEmail
  )
  .get(
    "/refreshToken/:token",
    validation(authValidation.refreshTokenSchema),
    authController.refreshToken
  )
  .post("/login", validation(authValidation.loginSchema), authController.login)
  .patch(
    "/sendCode",
    validation(authValidation.sendCodeSchema),
    asyncHandler(authController.sendCode)
  )
  .put(
    "/forgetPassword",
    validation(authValidation.forgetPasswordSchema),
    asyncHandler(authController.forgetPassword)
  )
  .post(
    "/loginWithGmail",
    validation(authValidation.signUpSchema),
    asyncHandler(authController.loginWithGmail)
  );
export default router;
