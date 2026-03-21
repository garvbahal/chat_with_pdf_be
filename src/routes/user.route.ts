import { Router } from "express";
import { upload } from "../utils/multer.js";
import { uploadPdf } from "../controllers/pdf.controller.js";
import { askQuestions } from "../controllers/chat.controller.js";
const userRouter = Router();

userRouter.post("/upload", upload.single("file"), uploadPdf);

userRouter.post("/ask", askQuestions);

export default userRouter;
