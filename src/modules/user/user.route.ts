import { Router } from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma/enums";

const router = Router();

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  userController.getMyProfile,
);

router.put(
  "/my-profile",
  auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER),
  userController.updateMyProfile,
);
export const userRoutes = router;
