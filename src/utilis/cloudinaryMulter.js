import multer from "multer";
export const uploadedFileValidation = {
  image: ["image/jpeg", "image/jpg", "image/png", "image/tif"],
  attachment: [
    "text/plain",
    "application/pdf",
    "application//vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
};
const uploadFileCloud = (fileType = []) => {
  const storage = multer.diskStorage({});
  const fileFilter = (req, file, cb) => {
    if (fileType.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file format"), false);
    }
  };
  const upload = multer({ fileFilter, storage });
  return upload;
};

export default uploadFileCloud;
