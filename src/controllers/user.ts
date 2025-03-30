import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { JWT_EXPIRES_IN, JWT_SECRET } from "../configs/jwt";

import {
  AuthRequest,
  LoginRequest,
  SignUpRequest,
  UpdateProfileRequest,
} from "../interfaces/request";
import User from "../models/user";
import { urlRegex } from "../configs/common";

export const signUp = async (req: SignUpRequest, res: any) => {
  try {
    let { walletAddress, password } = req.body;

    if (!walletAddress || !password) {
      return res
        .status(400)
        .json({ message: "Wallet address and password are required." });
    }

    walletAddress = walletAddress.toLowerCase();

    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Wallet address already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ walletAddress, password: hashedPassword });
    await newUser.save();

    res
      .status(201)
      .json({ message: "User registered successfully.", data: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
};

export const signIn = async (req: LoginRequest, res: any) => {
  try {
    let { walletAddress, password } = req.body;

    if (!walletAddress || !password) {
      return res
        .status(400)
        .json({ message: "Wallet address and password are required." });
    }

    walletAddress = walletAddress.toLowerCase();

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid wallet address or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid wallet address or password." });
    }

    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress } as any,
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    res.json({ message: "Login successfully.", data: token });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
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
