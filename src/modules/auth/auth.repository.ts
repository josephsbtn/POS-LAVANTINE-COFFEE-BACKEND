import UserModel from "../../database/schema/user/UserModel";
import { BaseRepository } from "../../database/BaseRepository";
import { Types } from "mongoose";

import { Role } from "../../shared/types/Role";

export interface IUserDocument {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: Role;
  fullname?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserPayload {
  username: string;
  password: string;
  role: Role;
  fullname?: string;
}

export interface IUpdateUserPayload extends Partial<ICreateUserPayload> {
  isActive?: boolean;
}

export class AuthRepository extends BaseRepository<
  IUserDocument,
  ICreateUserPayload,
  IUpdateUserPayload
> {
  constructor() {
    super(UserModel as any);
  }

  async findByUsername(username: string) {
    return this.model.findOne({ username, isActive: true }).select("+password");
  }
}
