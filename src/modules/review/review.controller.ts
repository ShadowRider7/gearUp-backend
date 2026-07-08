import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { sendResponse } from "../../utils/sendResponse";
import HttpStatus from "http-status";

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const review = await reviewService.createReview(userId as string, payload);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "review created successfully",
      data: {
        review,
      },
    });
  },
);

export const reviewController = {
  createReview,
};
