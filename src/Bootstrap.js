import connection from "./DB/connection.js";
import cors from "cors";
import categoryRouter from "./module/category/category.router.js";
import brandRouter from "./module/brand/brand.router.js";
import couponRouter from "./module/coupon/coupon.router.js";
import authRouter from "./module/auth/auth.router.js";
import productRouter from "./module/product/product.router.js";
import cartRouter from "./module/cart/cart.router.js";
import orderRouter from "./module/order/order.router.js";
import { globerErrorHandling } from "./utilis/asyncHandler.js";
function bootstrap(app, express) {
  var whitelist = ["http://example1.com", "http://example2.com"];
  connection();
  app.use((req, res, next) => {
    if (req.originalUrl == "order/webhook") {
      return next()
    } else {
      express.json({})(req, res, next)
    }
  });
  if (process.env.MODE == "DEV") {
    app.use(cors());
  } else {
    app.use(async (req, res, next) => {
      if (!whitelist.includes(req.header("origin"))) {
        return next(new Error("not allowed by cores", { cause: 502 }));
      }
      await res.header("Access-Control-Allow-Origin", "*");
      await res.header("Access-Control-Allow-Header", "*");
      await res.header("Access-Control-Allow-Private-network", "true");
      await res.header("Access-Control-Allow-Method", "*");
      next();
    });
  }
  app.use("/category", categoryRouter);
  app.use("/brand", brandRouter);
  app.use("/coupon", couponRouter);
  app.use("/auth", authRouter);
  app.use("/product", productRouter);
  app.use("/cart", cartRouter);
  app.use("/order", orderRouter);
  app.use(globerErrorHandling);
}
export default bootstrap;
