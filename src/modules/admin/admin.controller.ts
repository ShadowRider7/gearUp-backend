import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allUsers = await adminService.getAllUsersFromDB();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User list fetched successfully!",
      data: {
        allUsers,
      },
    });
  },
);
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const { status } = req.body;

    const updatedStatus = await adminService.updateUserStatus(
      id as string,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "user status updated successfully!",
      data: {
        updatedStatus,
      },
    });
  },
);
const getAllGearItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearItemsList = await adminService.getAllGearItems();
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Gear item list fetched successfully!",
      data: {
        gearItemsList,
      },
    });
  },
);
const getAllRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allOrders = await adminService.getAllRentalOrders();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "All rental orders list fetched successfully!",
      data: {
        allOrders,
      },
    });
  },
);
export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGearItems,
  getAllRentalOrders,
};
