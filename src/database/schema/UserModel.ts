import mongoose from "mongoose";

const enumRole = ["STAFF", "MANAGER"];

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
      select: false,
    },
    role: {
      type: String,
      enum: enumRole,
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
