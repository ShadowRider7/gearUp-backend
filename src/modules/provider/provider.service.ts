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
  await prisma.gearItem.delete({
    where: {
      id: gearItemId,
    },
  });
};
export const providerService = {
  addGearItem,
  updateGearItem,
  deleteGearItem,
};
