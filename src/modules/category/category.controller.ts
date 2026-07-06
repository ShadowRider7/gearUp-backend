import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const result = await categoryService.createCategoryInToDB(payload);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "category created successfully!",
      data: {
        result,
      },
    });
  },
);
const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryList = await categoryService.getAllCategory();
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Category list fetched successfully",
      data: {
        categoryList,
      },
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategory,
};
