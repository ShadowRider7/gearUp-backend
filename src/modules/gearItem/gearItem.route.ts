import { Router } from "express";
import { gearItemController } from "./gearItem.controller";

const router = Router();

router.get("/", gearItemController.getAllGearItems);

export const gearItemRoutes = router;
