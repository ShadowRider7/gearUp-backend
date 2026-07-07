import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IGearItemPayload, IUpdateGearItem } from "./provider.interface";

const addGearItem = async (providerId: string, payload: IGearItemPayload) => {
  const {
    categoryId,
    name,
    description,
    brand,
    pricePerDay,
    stock,
    images,
    specifications,
  } = payload;

  const result = await prisma.gearItem.create({
    data: {
      name,
      description,
      providerId,
      categoryId,
      brand,
      pricePerDay,
      stock,
      images,
      specifications,
    },
    include: {
      category: true,
    },
  });
  return result;
};

const updateGearItem = async (gearItemId: string, payload: IUpdateGearItem) => {
  const {
    name,
    description,
    brand,
    pricePerDay,
    stock,
    images,
    specifications,
  } = payload;

  const updatedGearItem = await prisma.gearItem.update({
    where: {
      id: gearItemId,
    },
    data: {
      name,
      description,
      brand,
      pricePerDay,
      stock,
      images,
      specifications,
    },
  });

  return updatedGearItem;
};

const deleteGearItem = async (gearItemId: string) => {
  await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearItemId,
    },
  });

  await prisma.gearItem.delete({
    where: {
      id: gearItemId,
    },
  });
};

const incomingOrder = async (providerId: string) => {
  const orders = await prisma.rentalOrder.findMany({
    where: {
      gearItem: {
        providerId,
      },
    },
    include: {
      customer: {
        omit: {
          password: true,
        },
        include: {
          profile: true,
        },
      },
      gearItem: {
        include: {
          category: true,
        },
      },
      payment: true,
      review: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders;
};

const updateOrderStatus = async (orderId: string, status: RentalStatus) => {
  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: {
      id: orderId,
    },
  });

  const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
    PLACED: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["PAID", "CANCELLED"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
  };

  if (!allowedTransitions[order.status].includes(status)) {
    throw new Error(
      `Cannot change order status from ${order.status} to ${status}.`,
    );
  }
  const updatedOrder = await prisma.rentalOrder.update({
    where: {
      id: orderId,
    },
    data: {
      status,
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

  return updatedOrder;
};
export const providerService = {
  addGearItem,
  updateGearItem,
  deleteGearItem,
  incomingOrder,
  updateOrderStatus,
};
