import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/create", auth(UserRole.ADMIN), categoryController.createCategory);
router.get("/", categoryController.getAllCategory);
router.put("/:id", auth(UserRole.ADMIN), categoryController.updateCategory);

export const categoryRoutes = router;
