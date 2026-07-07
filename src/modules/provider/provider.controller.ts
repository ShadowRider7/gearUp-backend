import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { providerService } from "./provider.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const addGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const providerId = req.user?.id;
    const payload = req.body;
    const gearItem = await providerService.addGearItem(
      providerId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Gear item listed successfully!",
      data: {
        gearItem,
      },
    });
  },
);

const updateGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearItemId = req.params.id;
    const payload = req.body;

    const updatedGearItem = await providerService.updateGearItem(
      gearItemId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Gear item updated successfully!",
      data: {
        updatedGearItem,
      },
    });
  },
);

const deleteGearItem = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    await providerService.deleteGearItem(id as string);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Gear item deleted successfully!",
      data: {},
    });
  },
);

const incomingOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const orders = await providerService.incomingOrder(id as string);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "provider's all order fetched successfully",
      data: {
        orders,
      },
    });
  },
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const statusUpdate = await providerService.updateOrderStatus(
      orderId as string,
      status,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "order status has been changed",
      data: {
        statusUpdate,
      },
    });
  },
);
export const providerController = {
  addGearItem,
  updateGearItem,
  deleteGearItem,
  incomingOrder,
  updateOrderStatus,
};
