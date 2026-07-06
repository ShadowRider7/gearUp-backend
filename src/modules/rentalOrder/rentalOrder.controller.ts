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

export const rentalOrderController = {
  createRentalOrder,
};
