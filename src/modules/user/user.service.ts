import config from "../../config/index";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcrypt";
import { RegisterUserPayload } from "./user.interface";

const registerUserInToDB = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto, phone, address, bio, role } =
    payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      role,
      password: hashedPassword,
      profile: {
        create: {
          profilePhoto,
          bio,
          phone,
          address,
        },
      },
    },
  });

  const user = await prisma.user.findUnique({
    where: {
      id: createdUser.id,
      email: createdUser.email || email,
    },
    omit: {
      password: true,
    },
  });
  return user;
};
const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return user;
};
const updateMyProfileInDB = async (userId: string, payload: any) => {
  const { name, email, profilePhoto, bio, phone, address } = payload;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      profile: {
        update: {
          profilePhoto,
          phone,
          address,
          bio,
        },
      },
    },
    omit: {
      password: true,
    },
    include: {
      profile: true,
    },
  });
  return updatedUser;
};
export const userService = {
  registerUserInToDB,
  getMyProfileFromDB,
  updateMyProfileInDB,
};
