import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../configs/jwt";

import { AuthRequest } from "../interfaces/request";

export const authenticateToken = (
  req: AuthRequest,
  res: any,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      userId: string;
      walletAddress: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};
