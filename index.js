import express from "express";
import path from "path";
import dotenv from "dotenv";
import bootstrap from "./src/Bootstrap.js";
import createInvoice from "./src/utilis/generatePdf.js";
dotenv.config({ path: path.resolve(`./config/.env`) });
const app = express();
const port = process.env.PORT_KEY || 3001;
bootstrap(app, express);
createInvoice({}, "invoice.pdf");
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
