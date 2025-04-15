import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { verifyMessage } from "ethers";

import { JWT_EXPIRES_IN, JWT_SECRET } from "../configs/jwt";

import {
  AuthRequest,
  LoginWithSignatureRequest,
  UpdateProfileRequest,
  UserRequestRequest,
} from "../interfaces/request";
import User from "../models/user";
import { urlRegex } from "../configs/common";

export const requestMessage = async (req: UserRequestRequest, res: any) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: "Wallet address is required." });
    }

    const message = `Login request for ${walletAddress} at ${new Date().toISOString()}`;
    const nonce = crypto.randomBytes(16).toString("hex");

    const fullMessage = `${message} - nonce: ${nonce}`;

    return res.json({ message: fullMessage });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const loginWithSignature = async (
  req: LoginWithSignatureRequest,
  res: any
) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ message: "Invalid signature." });
    }

    let user = await User.findOne({
      walletAddress: walletAddress.toLowerCase(),
    });
    if (!user) {
      user = new User({ walletAddress: walletAddress.toLowerCase() });
      await user.save();
    }

    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress } as any,
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    res.json({ message: "Login successfully.", data: token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Signature verification failed.", error: err });
  }
};

export const profile = async (req: AuthRequest, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Profile retrieved.", data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const updateProfile = async (req: UpdateProfileRequest, res: any) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const { bio, telegramUrl, githubUrl, xUrl, username } = req.body;

    if (bio && bio.length > 500) {
      return res
        .status(400)
        .json({ message: "Bio cannot exceed 500 characters." });
    }

    if (telegramUrl && !urlRegex.test(telegramUrl)) {
      return res.status(400).json({ message: "Invalid Telegram URL." });
    }
    if (githubUrl && !urlRegex.test(githubUrl)) {
      return res.status(400).json({ message: "Invalid GitHub URL." });
    }
    if (xUrl && !urlRegex.test(xUrl)) {
      return res.status(400).json({ message: "Invalid X (Twitter) URL." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { bio, telegramUrl, githubUrl, xUrl, username },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.json({ message: "Profile updated successfully.", data: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};
