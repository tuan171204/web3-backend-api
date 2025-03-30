import { Router } from "express";
import { profile, signIn, signUp, updateProfile } from "../controllers/user";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/profile", authenticateToken, profile);
router.put("/profile", authenticateToken, updateProfile);

export default router;
