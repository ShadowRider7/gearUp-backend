import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import config from "./config/index";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { userRoutes } from "./modules/user/user.route";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { ProviderRoutes } from "./modules/provider/provider.route";
import { gearItemRoutes } from "./modules/gearItem/gearItem.route";
import { rentalOrderRoutes } from "./modules/rentalOrder/rentalOrder.route";
import { adminRoutes } from "./modules/admin/admin.route";
import { reviewRoutes } from "./modules/review/review.route";
import { paymentRoutes } from "./modules/payment/payment.route";
const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello! , world!!");
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/provider", ProviderRoutes);
app.use("/api/gear", gearItemRoutes);
app.use("/api/rentals", rentalOrderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);

app.use(notFound);

app.use(globalErrorHandler);
export default app;
