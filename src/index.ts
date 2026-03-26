import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
app.use(express.json());

const frontend_url = process.env.FRONTEND_URL;

if (!frontend_url) {
  throw new Error("frontend url is missing");
}

app.use(
  cors({
    methods: ["GET", "POST", "PUT", "DELETE"],
    origin: [frontend_url],
    credentials: true,
  }),
);

import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import { connectDB } from "./config/mongo.js";

app.use("/api/v1", userRouter);
app.use("/api/v1", authRouter);
app.get("/api/v1/health", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Service working properly",
  });
});

connectDB();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
