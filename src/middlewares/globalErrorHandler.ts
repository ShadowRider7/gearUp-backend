import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = err.message || "Internal Server Error";
  const errorName = err.name || "Internal Server Error";

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = "Invalid input data or missing required fields.";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2000":
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Input value is too long for one or more fields.";
        break;

      case "P2001":
        statusCode = httpStatus.NOT_FOUND;
        errorMessage = "The requested record does not exist.";
        break;

      case "P2002":
        statusCode = httpStatus.CONFLICT;
        errorMessage = "Duplicate value. Record already exists.";
        break;

      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "Foreign key constraint failed.";
        break;

      case "P2011":
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "A required field cannot be null.";
        break;

      case "P2014":
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = "The requested operation violates a required relation.";
        break;

      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        errorMessage = "Requested resource was not found.";
        break;

      default:
        statusCode = httpStatus.BAD_REQUEST;
        errorMessage = err.message;
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Database connection failed.";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Database engine crashed unexpectedly.";
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    errorMessage = "Unknown database error occurred.";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    name: errorName,
    message: errorMessage,
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
