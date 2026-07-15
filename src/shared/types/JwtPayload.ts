import { Role } from "./Role";

export interface JwtPayload {
  userId: string;
  username: string;
  role: Role;
}
