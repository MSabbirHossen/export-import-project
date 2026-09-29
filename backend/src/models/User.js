import mongoose from "mongoose";
import { VALID_ROLES } from "../utils/roles.js";

const userSchema = new mongoose.Schema(
  {
    uid: {
      type: String,
      required: [true, "Firebase UID is required"],
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    displayName: {
      type: String,
      trim: true,
      default: "User",
    },
    photoURL: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: VALID_ROLES,
      default: "importer",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
      details: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    indexes: [{ uid: 1 }, { email: 1 }],
  },
);

const User = mongoose.model("User", userSchema);

export default User;
