import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./config/mongo.js";

app.use("/api/v1", userRouter);
app.use("/api/v1", authRouter);

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
