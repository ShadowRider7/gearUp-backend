import { Router } from "express";
import { rentalOrderController } from "./rentalOrder.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post(
  "/",
  auth(UserRole.CUSTOMER),
  rentalOrderController.createRentalOrder,
);

export const rentalOrderRoutes = router;
