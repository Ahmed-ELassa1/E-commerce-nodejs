import { customAlphabet } from "nanoid";
import userModel from "../../../DB/models/User.model.js";
import {
  generateToken,
  verifyToken,
} from "../../../utilis/GenerateAndVerifyToken.js";
import { compareHashed, hashPassword } from "../../../utilis/HashAndCompare.js";
import sendEmail from "../../../utilis/email.js";

export const signUp = async (req, res, next) => {
  const userExist = await userModel.findOne({ email: req.body.email });
  if (userExist) {
    return next(new Error("email already exist", { cause: 409 }));
  }
  const token = generateToken({
    payload: { email: req.body.email },
    signature: process.env.EMAIL_SIGNUTURE,
    expireIn: 60 * 30,
  });
  const rf_token = generateToken({
    payload: { email: req.body.email },
    signature: process.env.EMAIL_SIGNUTURE,
    expireIn: 60 * 60 * 24,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
  const rf_link = `${req.protocol}://${req.headers.host}/auth/refreshToken/${rf_token}`;
  const html = `
  <a href=${link} style="color:red;">confirm email</a>
  <br>
  <br>
  <a href=${rf_link} style="color:red;">send new email</a>
  `;
  const emailSended = sendEmail({
    to: req.body.email,
    html,
    subject: "confirm Email",
  });
  if (!emailSended) {
    return next(new Error("falied to send email", { cause: 404 }));
  }

  req.body.password = hashPassword({ plaintext: req.body.password });
  const newUser = await userModel.create(req.body);
  return res.status(201).json({
    message: "user created successfully",
    id: newUser._id,
  });
};
export const confirmEmail = async (req, res, next) => {
  const { email } = verifyToken({
    token: req.params.token,
    signature: process.env.EMAIL_SIGNUTURE,
  });
  const userExist = await userModel.findOne({ email: email });
  if (!userExist) {
    return res.redirect("https://www.facebook.com");
  }
  if (userExist.confirmEmail) {
    return res.redirect("https://www.facebook.com/BuffaloBurger/");
  }
  await userModel.updateOne({ email }, { confirmEmail: true });
  return res.redirect("https://www.facebook.com/BuffaloBurger/");
};
export const refreshToken = async (req, res, next) => {
  const { email } = verifyToken({
    token: req.params.token,
    signature: process.env.EMAIL_SIGNUTURE,
  });
  const userExist = await userModel.findOne({ email: email });
  if (!userExist) {
    return res.redirect("https://www.facebook.com");
  }
  if (userExist.confirmEmail) {
    return res.redirect("https://www.facebook.com/BuffaloBurger/");
  }
  const newToken = generateToken({
    payload: { email },
    signature: process.env.EMAIL_SIGNUTURE,
    expireIn: 60 * 10,
  });
  const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}`;
  const html = `
  <a href=${link} style="color:red;">confirm email</a>  `;
  const emailSended = sendEmail({
    to: email,
    html,
    subject: "confirm Email",
  });
  if (!emailSended) {
    return next(new Error("falied to send email", { cause: 404 }));
  }
  return res.send("<h2>check your email</h2>");
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("invalid email or password", { cause: 400 }));
  }
  if (!user.confirmEmail) {
    return next(new Error("please confirm your email", { cause: 400 }));
  }
  const match = compareHashed({
    plaintext: password,
    hashedValue: user.password,
  });
  if (!match) {
    return next(new Error("invalid email or password", { cause: 400 }));
  }
  if (user.isDeleted) {
    user.isDeleted = false;
  }
  user.status = "online";
  await user.save();
  const token = generateToken({
    payload: { email: email, id: user._id, role: user.role },
    expireIn: 60 * 30,
  });
  const refToken = generateToken({
    payload: { email: email, id: user._id, role: user.role },
    expireIn: 60 * 60 * 24 * 30,
  });

  return res.status(200).json({
    message: "Done",
    token,
    refToken,
  });
};
export const sendCode = async (req, res, next) => {
  const userExist = await userModel.findOne({ email: req.body.email });
  if (!userExist) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  if (!userExist.confirmEmail) {
    return next(new Error("please confirm email first", { cause: 400 }));
  }
  const nanoCode = customAlphabet("1234567890", 5);
  const code = nanoCode();
  const emailSended = sendEmail({
    to: req.body.email,
    html: `<h2>${code}</h2>`,
    subject: "forget password",
  });
  if (!emailSended) {
    return next(new Error("falied to send email", { cause: 404 }));
  }
  await userModel.updateOne({ email: req.body.email }, { code });
  return res.status(200).json({ message: "please check your email" });
};
export const forgetPassword = async (req, res, next) => {
  const { email, code } = req.body;
  const userExist = await userModel.findOne({ email });
  if (!userExist) {
    return next(new Error("invalid email", { cause: 404 }));
  }
  if (code != userExist.code || code == null) {
    return next(new Error("wrong code", { cause: 400 }));
  }
  const match = compareHashed({
    plaintext: req.body.password,
    hashedValue: userExist.password,
  });
  if (match) {
    return next(new Error("you enter an old password", { cause: 400 }));
  }
  const password = hashPassword({ plaintext: req.body.password });

  const newUser = await userModel.findOneAndUpdate(
    { email: email },
    { password, code: null,status:"offline" },
    { new: true }
  );
  return res.status(200).json({ message: "done", user: newUser });
};
