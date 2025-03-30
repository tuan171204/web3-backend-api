import mongoose from "mongoose";

import { urlRegex } from "../configs/common";

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: { type: String, required: true },
  username: { type: String, default: null },
  bio: { type: String, maxlength: 500, default: null },
  telegramUrl: {
    type: String,
    default: null,
    validate: {
      validator: (v: string) => !v || urlRegex.test(v),
      message: "Invalid URL.",
    },
  },
  githubUrl: {
    type: String,
    default: null,
    validate: {
      validator: (v: string) => !v || urlRegex.test(v),
      message: "Invalid URL.",
    },
  },
  xUrl: {
    type: String,
    default: null,
    validate: {
      validator: (v: string) => !v || urlRegex.test(v),
      message: "Invalid URL.",
    },
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
