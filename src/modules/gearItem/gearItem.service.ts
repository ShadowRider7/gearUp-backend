import { prisma } from "../../lib/prisma";

const getAllGearItems = async () => {
  const allGearItems = await prisma.gearItem.findMany({
    include: {
      category: true,
    },
  });
  return allGearItems;
};

export const gearItemService = {
  getAllGearItems,
};
