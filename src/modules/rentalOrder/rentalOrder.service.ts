import { prisma } from "../../lib/prisma";
import { IRentalOrder } from "./rentalOrder.interface";

const createRentalOrder = async (userId: string, payload: IRentalOrder) => {
  const { gearItemId, startDate, endDate, quantity } = payload;

  const gearItem = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearItemId,
    },
  });
  if (!gearItem.isAvailable) {
    throw new Error("This gear item is currently unavailable.");
  }

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  if (start >= end) {
    throw new Error("End date must be after start date");
  }

  const reservedQuantity = await prisma.rentalOrder.aggregate({
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
    _sum: {
      quantity: true,
    },
  });

  const reserved = reservedQuantity._sum.quantity ?? 0;
  const available = gearItem.stock - reserved;

  if (quantity > available) {
    throw new Error("Not enough stock available for the selected dates.");
  }
  const rentalDays = Math.max(
    1,
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
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
      gearItem: {
        include: {
          category: true,
          provider: {
            omit: {
              password: true,
            },
            include: {
              profile: true,
            },
          },
        },
      },

      customer: {
        omit: {
          password: true,
        },
      },
    },
  });
  return rentalOrder;
};

const usersRentalOrders = async (userId: string) => {
  const usersRentalOrders = await prisma.rentalOrder.findMany({
    where: {
      customerId: userId,
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
    orderBy: {
      createdAt: "desc",
    },
  });
  return usersRentalOrders;
};

const rentalOrderDetails = async (rentalOrderId: string) => {
  const rentalOrderDetails = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: rentalOrderId,
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
  return rentalOrderDetails;
};
export const rentalOrderService = {
  createRentalOrder,
  usersRentalOrders,
  rentalOrderDetails,
};
