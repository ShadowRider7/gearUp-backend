import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const getAllUsersFromDB = async () => {
  const allUsers = await prisma.user.findMany({
    where: {
      role: {
        in: [UserRole.CUSTOMER, UserRole.PROVIDER],
      },
    },
    include: {
      profile: true,
      rentals: true,
      reviews: true,
      gearItems: true,
    },
    omit: {
      password: true,
    },
  });
  return allUsers;
};
const updateUserStatus = async (userId: string, status: UserStatus) => {
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    data: {
      status,
    },
    include: {
      profile: true,
    },
  });
  return updatedUser;
};
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
const getAllRentalOrders = async () => {
  const allOrders = await prisma.rentalOrder.findMany({
    include: {
      customer: true,
      gearItem: {
        include: {
          provider: {
            omit: {
              password: true,
            },
          },
        },
      },
      payment: true,
      review: true,
    },
  });
  return allOrders;
};
export const adminService = {
  getAllUsersFromDB,
  updateUserStatus,
  getAllGearItems,
  getAllRentalOrders,
};
