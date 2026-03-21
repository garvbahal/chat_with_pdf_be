import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authN = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.get("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        const jwt_secret = process.env.JWT_SECRET as string;

        const payload = jwt.verify(token, jwt_secret);

        if (payload) {
            if (typeof payload !== "string" && "id" in payload) {
                req.userId = String(payload.id);
                return next();
            }
        }

        return res.status(401).json({
            success: false,
            message: "You are not logged in",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while authenticating the user",
            error: error,
        });
    }
};
