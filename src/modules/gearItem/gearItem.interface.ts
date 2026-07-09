import { GearItemWhereInput } from "../../../generated/prisma/models";

export interface IGearItemQuery extends GearItemWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
