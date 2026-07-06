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

export const providerController = {
  addGearItem,
};
