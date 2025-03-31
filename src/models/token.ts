import mongoose from "mongoose";
import { urlRegex } from "../configs/common";

const TokenSchema = new mongoose.Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  decimals: { type: Number, required: true, min: 1, max: 18 },
  supply: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  websiteUrl: {
    type: String,
    default: null,
    validate: {
      validator: (v: string) => !v || urlRegex.test(v),
      message: "Invalid URL.",
    },
  },
  telegramUrl: {
    type: String,
    default: null,
    validate: {
      validator: (v: string) => !v || urlRegex.test(v),
      message: "Invalid URL.",
    },
  },
  discordUrl: {
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
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Token", TokenSchema);
