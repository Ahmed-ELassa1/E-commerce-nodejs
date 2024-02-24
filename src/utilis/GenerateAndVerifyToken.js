import jwt from "jsonwebtoken";

export const generateToken = ({
  payload = {},
  signature = process.env.JWT_TOKEN_SIGNUTURE,
  expireIn = 60 * 60,
} = {}) => {
  const token = jwt.sign(payload, signature, { expiresIn: parseInt(expireIn) });
  return token;
};
export const verifyToken = ({
  token,
  signature = process.env.JWT_TOKEN_SIGNUTURE,
} = {}) => {
  try {
    const decodedToken = jwt.verify(token, signature);
    return decodedToken;
  } catch (error) {
    return next(new Error(error, { cause: 400 }));
  }
};
