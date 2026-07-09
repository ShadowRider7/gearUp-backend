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

  let isAvailable = payload.isAvailable;

  if (stock !== undefined) {
    isAvailable = stock > 0;
  }

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
      isAvailable,
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
      status: RentalStatus.PLACED,
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

const providersAllOrder = async (providerId: string) => {
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
const reStockNeededGearItems = async (providerId: string) => {
  const reStockNeededGearItems = await prisma.gearItem.findMany({
    where: {
      providerId,
      stock: {
        lte: 1, //provider can set
      },
    },
  });

  return reStockNeededGearItems;
};

const updateOrderStatus = async (orderId: string, status: RentalStatus) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.rentalOrder.findUniqueOrThrow({
      where: { id: orderId },
      include: { gearItem: true },
    });

    const allowedTransitions: Record<RentalStatus, RentalStatus[]> = {
      PLACED: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["PAYMENT_INITIATED", "CANCELLED"],
      PAYMENT_INITIATED: ["PAID", "CONFIRMED", "CANCELLED"],
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

    if (status === "PICKED_UP") {
      if (order.gearItem.stock < order.quantity) {
        throw new Error("Insufficient stock.");
      }

      const gearUpdate = await tx.gearItem.update({
        where: { id: order.gearItemId },
        data: {
          stock: {
            decrement: order.quantity,
          },
        },
      });

      if (gearUpdate.stock === 0) {
        await tx.gearItem.update({
          where: { id: order.gearItemId },
          data: {
            isAvailable: false,
          },
        });
      }
    }

    const updatedOrder = await tx.rentalOrder.update({
      where: { id: orderId },
      data: { status },
      include: {
        customer: { omit: { password: true } },
        gearItem: true,
        payment: true,
        review: true,
      },
    });

    return updatedOrder;
  });
};

export const providerService = {
  addGearItem,
  updateGearItem,
  deleteGearItem,
  incomingOrder,
  updateOrderStatus,
  reStockNeededGearItems,
  providersAllOrder,
};
