import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gearItemService } from "./gearItem.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const getAllGearItems = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearItemsList = await gearItemService.getAllGearItems();
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
const gearItemDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const gearItemId = req.params.id;
    const gearItemDetails = await gearItemService.gearItemDetails(
      gearItemId as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Gear item details fetched successfully by id!",
      data: {
        gearItemDetails,
      },
    });
  },
);
export const gearItemController = {
  getAllGearItems,
  gearItemDetails,
};
