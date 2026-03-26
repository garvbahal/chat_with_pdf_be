import { Router } from "express";
import {
  login,
  resendOtp,
  signup,
  verifyOtp,
} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signup/verify", verifyOtp);
authRouter.post("/login", login);
authRouter.post("/resendOtp", resendOtp);

export default authRouter;
