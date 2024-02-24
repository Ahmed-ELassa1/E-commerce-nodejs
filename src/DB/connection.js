import mongoose from "mongoose";
const connection = async () => {
  return await mongoose
    .connect(`${process.env.DB_URL}/Ecommerce`)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((error) => {
      console.log("Failed to connect to DB");
      console.log(error);
    });
};
export default connection;
