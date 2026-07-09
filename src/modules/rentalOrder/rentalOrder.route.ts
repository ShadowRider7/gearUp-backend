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

router.get(
  "/",
  auth(UserRole.CUSTOMER),
  rentalOrderController.usersRentalOrders,
);

router.get(
  "/:id",
  auth(UserRole.CUSTOMER, UserRole.ADMIN),
  rentalOrderController.rentalOrderDetails,
);

router.patch(
  "/return/:id",
  auth(UserRole.CUSTOMER),
  rentalOrderController.returnProduct,
);

export const rentalOrderRoutes = router;
