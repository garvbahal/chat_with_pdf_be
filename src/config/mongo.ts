import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("Mongo DB uri missing");
        }
        await mongoose.connect(mongoUri);
        console.log("DB connection successfull");
    } catch (error) {
        console.log("DB connection not successfull");
        console.log(error);
        process.exit(1);
    }
};
