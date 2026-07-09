import { prisma } from "../../lib/prisma";
import { ICategoryPayload, ICategoryUpdate } from "./category.interface";

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
const updateCategory = async (categoryId: string, payload: ICategoryUpdate) => {
  const { name, description } = payload || {};
  const category = await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      name,
      description,
    },
  });
  return category;
};
export const categoryService = {
  createCategoryInToDB,
  getAllCategory,
  updateCategory,
};
