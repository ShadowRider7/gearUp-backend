import { prisma } from "../../lib/prisma";
import { IRentalOrder } from "./rentalOrder.interface";

const createRentalOrder = async (userId: string, payload: IRentalOrder) => {
  const { gearItemId, startDate, endDate, quantity } = payload;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const gearItem = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearItemId,
    },
  });

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }
  if (quantity > gearItem.stock) {
    throw new Error("Requested quantity exceeds available stock");
  }
  if (!gearItem.isAvailable) {
    throw new Error("This gear item is currently unavailable.");
  }
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  if (start >= end) {
    throw new Error("End date must be after start date");
  }

  const existingRental = await prisma.rentalOrder.findFirst({
    where: {
      gearItemId,
      status: {
        in: ["PLACED", "CONFIRMED", "PAID", "PICKED_UP"],
      },
      startDate: {
        lte: end,
      },
      endDate: {
        gte: start,
      },
    },
  });

  if (existingRental) {
    throw new Error("This gear item is already booked for the selected dates.");
  }
  const rentalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const totalAmount = rentalDays * gearItem.pricePerDay * quantity;

  const rentalOrder = await prisma.rentalOrder.create({
    data: {
      customerId: userId,
      gearItemId,
      startDate: start,
      endDate: end,
      quantity,
      totalAmount,
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
      },
      gearItem: true,
      payment: true,
      review: true,
    },
  });
  return rentalOrder;
};

export const rentalOrderService = {
  createRentalOrder,
};
