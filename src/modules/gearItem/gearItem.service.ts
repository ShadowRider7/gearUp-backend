import { GearItemWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IGearItemQuery } from "./gearItem.interface";

const getAllGearItems = async (query: IGearItemQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ?? "createdAt";
  const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

  const andConditions: GearItemWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        { name: { contains: query.searchTerm, mode: "insensitive" } },
        { brand: { contains: query.searchTerm, mode: "insensitive" } },
        { description: { contains: query.searchTerm, mode: "insensitive" } },
      ],
    });
  }

  if (query.name) andConditions.push({ name: query.name });
  if (query.brand) andConditions.push({ brand: query.brand });
  if (query.categoryId) andConditions.push({ categoryId: query.categoryId });
  if (query.providerId) andConditions.push({ providerId: query.providerId });
  if (query.stock) {
    andConditions.push({ stock: { gte: Number(query.stock) } });
  }

  const allGearItems = await prisma.gearItem.findMany({
    where: { AND: andConditions },
    include: {
      category: true,
      provider: {
        omit: { password: true },
      },
      _count: {
        select: {
          rentals: true,
          reviews: true,
        },
      },
    },
    orderBy: { [sortBy]: sortOrder },
    skip,
    take: limit,
  });

  const averages = await prisma.review.groupBy({
    by: ["gearItemId"],
    _avg: { rating: true },
  });

  const averageMap = new Map<string, number>(
    averages.map((avg) => [avg.gearItemId, avg._avg.rating ?? 0]),
  );

  const result = allGearItems.map((item) => ({
    ...item,
    averageRating: Number((averageMap.get(item.id) || 0).toFixed(1)),
  }));

  const totalItemCount = await prisma.gearItem.count({
    where: { AND: andConditions },
  });

  return {
    data: result,
    meta: {
      page,
      limit,
      total: totalItemCount,
      totalPages: Math.ceil(totalItemCount / limit),
    },
  };
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
