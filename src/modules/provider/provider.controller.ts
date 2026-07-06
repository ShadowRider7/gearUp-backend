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
      message: "Gear item listed successfully!",
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

export const providerController = {
  addGearItem,
  updateGearItem,
  deleteGearItem,
};
