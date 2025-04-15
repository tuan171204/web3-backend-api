import mongoose from "mongoose";
import { urlRegex } from "../configs/common";

const TokenSchema = new mongoose.Schema({
  tokenAddress: { type: String, required: true, unique: true, lowercase: true },
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  maxSupply: { type: String, required: true },
  amountPerMint: { type: String, required: true },
  mintFee: { type: String, required: true },
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
  owner: { type: String, required: true, lowercase: true },
});

export default mongoose.model("Token", TokenSchema);
