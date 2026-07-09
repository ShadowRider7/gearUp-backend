import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createPaymentIntent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const { rentalOrderId } = req.body;

    const Result = await paymentService.createPaymentIntent(
      userId as string,
      rentalOrderId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "payment link fetched.",
      data: Result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const event = req.body as Buffer;
    console.log(
      "Webhook body type:",
      typeof req.body,
      "Is Buffer:",
      Buffer.isBuffer(req.body),
    );
    const signature = req.headers["stripe-signature"]!;

    await paymentService.handleWebhook(event, signature as string);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "webhook triggered successfully",
      data: {},
    });
  },
);

const paymentHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;

    const customerPaymentHistory = await paymentService.paymentHistory(
      id as string,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "payment history fetched successfully.",
      data: customerPaymentHistory,
    });
  },
);
export const paymentController = {
  createPaymentIntent,
  handleWebhook,
  paymentHistory,
};
