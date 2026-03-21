import { Router } from "express";
import { upload } from "../utils/multer.js";
import { uploadPdf } from "../controllers/pdf.controller.js";
import { askQuestions } from "../controllers/chat.controller.js";
import { authN } from "../middlewares/auth.middleware.js";
const userRouter = Router();

userRouter.post("/upload", authN, upload.single("file"), uploadPdf);

userRouter.post("/ask", authN, askQuestions);

export default userRouter;
