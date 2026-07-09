import { Router } from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";
import { providerService } from "./provider.service";

const router = Router();

router.post("/gear", auth(UserRole.PROVIDER), providerController.addGearItem);

router.put(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.updateGearItem,
);

router.delete(
  "/gear/:id",
  auth(UserRole.PROVIDER),
  providerController.deleteGearItem,
);

router.get(
  "/incomingOrders",
  auth(UserRole.PROVIDER),
  providerController.incomingOrder,
);

router.get(
  "/orders",
  auth(UserRole.PROVIDER),
  providerController.providersAllOrders,
);

router.get(
  "/stock",
  auth(UserRole.PROVIDER),
  providerController.reStockNeededGearItems,
);

router.patch(
  "/orders/:id",
  auth(UserRole.PROVIDER),
  providerController.updateOrderStatus,
);
export const ProviderRoutes = router;
