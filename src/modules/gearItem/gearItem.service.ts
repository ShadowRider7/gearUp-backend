import { prisma } from "../../lib/prisma";

const getAllGearItems = async () => {
  const allGearItems = await prisma.gearItem.findMany({
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
    },
  });
  return allGearItems;
};
const gearItemDetails = async (gearItemId: string) => {
  const result = await prisma.gearItem.findUniqueOrThrow({
    where: {
      id: gearItemId,
    },
    include: {
      category: true,
      provider: {
        omit: {
          password: true,
        },
      },
      rentals: true,
      reviews: true,
    },
  });
  return result;
};
export const gearItemService = {
  getAllGearItems,
  gearItemDetails,
};
