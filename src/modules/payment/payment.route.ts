import { Router } from "express";
import { paymentController } from "./payment.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  paymentController.createPaymentIntent,
);
router.post("/webhook", paymentController.handleWebhook);

router.get("/", auth(UserRole.CUSTOMER), paymentController.paymentHistory);
export const paymentRoutes = router;
