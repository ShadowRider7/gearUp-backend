import { includes } from "zod";
import { prisma } from "../../lib/prisma";
import { ICategoryPayload } from "./category.interface";
import { tr } from "zod/locales";

const createCategoryInToDB = async (payload: ICategoryPayload) => {
  const { name, description } = payload;

  const category = await prisma.category.create({
    data: {
      name,
      description,
    },
  });
  return category;
};

const getAllCategory = async () => {
  const result = await prisma.category.findMany({
    include: {
      gearItems: true,
    },
  });
  return result;
};

export const categoryService = {
  createCategoryInToDB,
  getAllCategory,
};
