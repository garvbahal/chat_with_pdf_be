import { Router } from "express";
import { login, signup, verifyOtp } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signup/verify", verifyOtp);
authRouter.post("/login", login);

export default authRouter;
