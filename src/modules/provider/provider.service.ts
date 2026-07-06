import { prisma } from "../../lib/prisma";
import { IGearItemPayload } from "./provider.interface";

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
export const providerService = {
  addGearItem,
};
