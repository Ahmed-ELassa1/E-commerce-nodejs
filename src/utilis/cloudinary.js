import path from "path";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
dotenv.config({ path: path.resolve("./config/.env") });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: `${process.env.CLOUDINARY_API_KEY}`,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary.v2;
