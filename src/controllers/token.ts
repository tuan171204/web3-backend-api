import mongoose from "mongoose";

import Token from "../models/token";
import {
  CreateTokenRequest,
  TokenRequest,
  TokensRequest,
  UserTokensRequest,
} from "../interfaces/request";
import { urlRegex } from "../configs/common";

export const createToken = async (req: CreateTokenRequest, res: any) => {
  try {
    const {
      name,
      symbol,
      decimals,
      supply,
      description,
      websiteUrl,
      telegramUrl,
      discordUrl,
      xUrl,
    } = req.body;

    if (!name || !symbol || !decimals || !supply || !description) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    if (description.length > 500) {
      return res
        .status(400)
        .json({ message: "Description cannot exceed 500 characters." });
    }

    if (telegramUrl && !urlRegex.test(telegramUrl)) {
      return res.status(400).json({ message: "Invalid Telegram URL." });
    }
    if (websiteUrl && !urlRegex.test(websiteUrl)) {
      return res.status(400).json({ message: "Invalid Website URL." });
    }
    if (xUrl && !urlRegex.test(xUrl)) {
      return res.status(400).json({ message: "Invalid X (Twitter) URL." });
    }
    if (discordUrl && !urlRegex.test(discordUrl)) {
      return res.status(400).json({ message: "Invalid Discord URL." });
    }

    if (decimals < 1 || decimals > 18) {
      return res
        .status(400)
        .json({ message: "Decimals must be between 1 and 18." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const newToken = new Token({
      name,
      symbol,
      decimals,
      supply,
      description,
      image: imagePath,
      websiteUrl,
      telegramUrl,
      discordUrl,
      xUrl,
      owner: req.user.userId,
    });

    await newToken.save();
    res
      .status(201)
      .json({ message: "Token created successfully.", data: newToken });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const tokenDetail = async (req: TokenRequest, res: any) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid token ID." });
    }

    const token = await Token.findById(id);
    if (!token) {
      return res.status(404).json({ message: "Token not found." });
    }

    res.json({ message: "Token detail retrieved.", data: token });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const allTokens = async (req: TokensRequest, res: any) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const tokens = await Token.find().skip(skip).limit(limit);
    const totalTokens = await Token.countDocuments();

    res.json({
      message: "Tokens retrieved.",
      pagination: {
        total: totalTokens,
        page,
        limit,
      },
      data: tokens,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const userTokens = async (req: UserTokensRequest, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const tokens = await Token.find({ owner: req.user.userId })
      .skip(skip)
      .limit(limit);
    const totalTokens = await Token.countDocuments({ owner: req.user.userId });

    res.json({
      message: "Tokens retrieved.",
      pagination: {
        total: totalTokens,
        page,
        limit,
      },
      data: tokens,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};
