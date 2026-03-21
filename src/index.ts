import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());

import userRouter from "./routes/user.route.js";

app.use("/api/v1/", userRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
});
