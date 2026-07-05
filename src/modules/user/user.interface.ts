import { UserRole, UserStatus } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  address?: string;
}
