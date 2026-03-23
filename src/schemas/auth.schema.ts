import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email is required"),
    password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
    email: z.string().email().min(1, "Email is required"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});
