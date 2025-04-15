import dotenv from "dotenv";

dotenv.config();

export const urlRegex =
  /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}([\/\w .-]*)*\/?$/;
export const RPC_URL = process.env.RPC_URL;
