import { Request } from "express";

export interface SignUpRequest extends Request {
  body: {
    walletAddress: string;
    password: string;
  };
}

export interface LoginRequest extends Request {
  body: {
    walletAddress: string;
    password: string;
  };
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    walletAddress: string;
  };
}

export interface CreateTokenRequest extends Request {
  body: {
    name: string;
    symbol: string;
    decimals: number;
    supply: number;
    description: string;
    websiteUrl?: string;
    telegramUrl?: string;
    discordUrl?: string;
    xUrl?: string;
  };
  user?: { userId: string };
  file?: Express.Multer.File;
}

export interface TokenRequest extends Request {
  params: {
    id: string;
  };
}

export interface TokensRequest extends Request {
  query: {
    page?: string;
    limit?: string;
  };
}

export interface UserTokensRequest extends Request {
  user?: { userId: string };
  query: {
    page?: string;
    limit?: string;
  };
}

export interface UpdateProfileRequest extends Request {
  user?: { userId: string };
  body: {
    bio?: string;
    telegramUrl?: string;
    githubUrl?: string;
    xUrl?: string;
    username?: string;
  };
}
