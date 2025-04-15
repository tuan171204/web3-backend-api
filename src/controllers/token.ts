import mongoose from "mongoose";

import Token from "../models/token";
import {
  CreateTokenRequest,
  TokenRequest,
  TokensRequest,
  UserTokensRequest,
} from "../interfaces/request";
import { getTokenDeployedFromTxHash } from "../services/token";
import { urlRegex } from "../configs/common";
import { ethers } from "ethers";

export const createToken = async (req: CreateTokenRequest, res: any) => {
  try {
    const { txHash, description, websiteUrl, telegramUrl, discordUrl, xUrl } =
      req.body;

    if (!txHash || !description) {
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

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    const tokenDeployed = await getTokenDeployedFromTxHash(txHash);

    let token = await Token.findOne({
      tokenAddress: tokenDeployed.tokenAddress,
    });

    if (token) return res.status(400).json({ message: "Token existed." });

    if (
      ethers.getAddress(tokenDeployed.owner) !==
      ethers.getAddress(req.user.walletAddress)
    )
      return res.status(400).json({ message: "Invalid owner." });

    token = new Token({
      ...tokenDeployed,
      description,
      image: imagePath,
      websiteUrl,
      telegramUrl,
      discordUrl,
      xUrl,
    });

    await token.save();
    res
      .status(201)
      .json({ message: "Token created successfully.", data: token });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const tokenDetail = async (req: TokenRequest, res: any) => {
  try {
    const { address } = req.params;

    const token = await Token.findOne({ tokenAddress: address.toLowerCase() });
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

    const tokens = await Token.find({ owner: req.user.walletAddress })
      .skip(skip)
      .limit(limit);
    const totalTokens = await Token.countDocuments({ owner: req.user.walletAddress });

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
