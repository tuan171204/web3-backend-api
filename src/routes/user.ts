import { Router } from "express";
import { loginWithSignature, profile, requestMessage, updateProfile } from "../controllers/user";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.post("/request", requestMessage);
router.post("/login", loginWithSignature);
router.get("/profile", authenticateToken, profile);
router.put("/profile", authenticateToken, updateProfile);

export default router;
