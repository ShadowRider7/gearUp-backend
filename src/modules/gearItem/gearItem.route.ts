import { Router } from "express";
import { gearItemController } from "./gearItem.controller";

const router = Router();

router.get("/", gearItemController.getAllGearItems);
router.get("/:id", gearItemController.gearItemDetails);

export const gearItemRoutes = router;
