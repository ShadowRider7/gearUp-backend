import { JsonArray } from "../../../generated/prisma/internal/prismaNamespace";

export interface IGearItemPayload {
  categoryId: string;
  name: string;
  description: string;
  brand: string;
  pricePerDay: number;
  stock: number;
  images: string[];
  specifications?: JsonArray;
}
