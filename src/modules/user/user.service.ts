import config from "../../config";
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
export const userService = {
  registerUserInToDB,
};
