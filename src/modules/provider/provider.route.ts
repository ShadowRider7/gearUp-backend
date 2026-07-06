import { Router } from "express";
import { providerController } from "./provider.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/gear", auth(UserRole.PROVIDER), providerController.addGearItem);

export const ProviderRoutes = router;
