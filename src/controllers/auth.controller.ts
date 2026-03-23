import type { Request, Response } from "express";
import {
    loginSchema,
    signupSchema,
    verifyOtpSchema,
} from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import { OTPModel } from "../models/otp.model.js";
import { sendMail } from "../utils/sendmail.js";
dotenv.config();

export const signup = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = signupSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                error: error,
            });
        }
        const { email, password } = data;

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false,
        });

        const otpHash = await bcrypt.hash(otp, 10);

        const otpResponse = await OTPModel.findOneAndUpdate(
            { email },
            {
                $set: {
                    otpHash: otpHash,
                    "data.password": hashedPassword,
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
                },
            },
            { upsert: true, new: true },
        );

        await sendMail(email, "OTP for signup", otp);

        return res.status(200).json({
            success: true,
            message: "OTP send successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while signing up",
            error: error,
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = loginSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                error: error,
            });
        }

        const { email, password } = data;

        const userExists = await User.findOne({
            email: email,
        });

        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist, please sign up",
            });
        }

        if (await bcrypt.compare(password, userExists.password)) {
            const jwtsecret = process.env.JWT_SECRET || "12345";

            const token = jwt.sign(
                {
                    id: userExists._id,
                },
                jwtsecret,
                {
                    expiresIn: "7d",
                },
            );

            return res.status(200).json({
                success: true,
                message: "User logged in successfully",
                token,
            });
        }
        return res.status(401).json({
            success: false,
            message: "Password doesn't match",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",
        });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = verifyOtpSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                error: error,
            });
        }
        const { email, otp } = data;

        
    } catch (error) {}
};
