import mongoose from "mongoose";
import { Role } from "../../../shared/types/Role";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      required: true,
      index: true,
    },
    fullname: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = mongoose.model("User", UserSchema);
export default UserModel;

export type UserType = mongoose.InferSchemaType<typeof UserSchema>;
