import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalOrderService } from "./rentalOrder.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createRentalOrder = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const rentalOrder = await rentalOrderService.createRentalOrder(
      userId as string,
      payload,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "rental order created successfully",
      data: {
        rentalOrder,
      },
    });
  },
);

const usersRentalOrders = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const usersRentalOrders = await rentalOrderService.usersRentalOrders(
      userId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User's all rental orders fetched successfully",
      data: {
        usersRentalOrders,
      },
    });
  },
);

const rentalOrderDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const orderDetails = await rentalOrderService.rentalOrderDetails(
      orderId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Order details fetched successfully",
      data: {
        orderDetails,
      },
    });
  },
);
export const rentalOrderController = {
  createRentalOrder,
  usersRentalOrders,
  rentalOrderDetails,
};
