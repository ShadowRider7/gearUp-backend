import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReview } from "./review.interface";

const createReview = async (userId: string, payload: IReview) => {
  const { rentalOrderId, rating, comment } = payload;
  const rentalOrder = await prisma.rentalOrder.findFirstOrThrow({
    where: {
      id: rentalOrderId,
      customerId: userId,
    },
    include: {
      gearItem: true,
    },
  });

  if (rentalOrder.status !== RentalStatus.RETURNED) {
    throw new Error("can't write review before return");
  }

  const review = await prisma.review.create({
    data: {
      customerId: userId,
      gearItemId: rentalOrder.gearItemId,
      rentalOrderId,
      rating,
      comment,
    },
  });

  return review;
};

export const reviewService = { createReview };
