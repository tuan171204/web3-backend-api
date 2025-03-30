import { Router } from "express";
import {
  allTokens,
  createToken,
  tokenDetail,
  userTokens,
} from "../controllers/token";
import upload from "../middleware/upload";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/", authenticateToken, upload.single("image"), createToken);
router.get("/user", authenticateToken, userTokens);
router.get("/:id", tokenDetail);
router.get("/", allTokens);

export default router;
