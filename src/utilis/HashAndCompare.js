import bcrypt from "bcryptjs";

export const hashPassword = ({ plaintext, salt = process.env.SALT_ROUND }) => {
  const hashedPassword = bcrypt.hashSync(plaintext, parseInt(salt));
  return hashedPassword;
};
export const compareHashed = ({ plaintext, hashedValue }) => {
  const match = bcrypt.compareSync(plaintext, hashedValue);
  return match;
};
