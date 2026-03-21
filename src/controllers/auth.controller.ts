import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth.schema.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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

        const userResponse = await User.create({
            email,
            password: hashedPassword,
        });

        userResponse.password = "";

        return res.status(200).json({
            success: true,
            message: "User signed up successfully",
            userResponse,
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
                message: "User doesn't exists please signup",
            });
        }

        const jwtsecret: string = process.env.JWT_SECRET as string;
        // if (!jwtsecret) {
        //     throw new Error("JWT_SECRET is not defined");
        // }

        const token = jwt.sign(
            {
                id: userExists._id,
            },
            jwtsecret as string,
            {
                expiresIn: "7d",
            },
        );
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while logging in",
        });
    }
};
