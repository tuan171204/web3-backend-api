import { Router } from "express";
import userRoutes from "./user";
import tokenRoutes from "./token"

const router = Router();

router.use("/users", userRoutes);
router.use("/tokens", tokenRoutes);

export default router;
