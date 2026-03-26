import type { Request, Response } from "express";
import {
  loginSchema,
  resendOtpSchema,
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
import { getMailHTMLTemplate } from "../utils/emailTemplate.js";
import { getWelcomeEmailTemplate } from "../utils/welcomeEmailTemplate.js";
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
          "data.passwordHashed": hashedPassword,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
      },
      { upsert: true, new: true },
    );

    const mailHTML = getMailHTMLTemplate(otp);
    try {
      await sendMail(email, "OTP for signup", mailHTML);
    } catch (error) {
      await OTPModel.deleteOne({ email });
      console.log("Error while sending mail", error);
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP",
      });
    }

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

    console.log("Otp is : ", otp);
    console.log("Email is : ", email);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const otpResponse = await OTPModel.findOne({ email: email });

    if (!otpResponse) {
      return res.status(404).json({
        success: false,
        message: "OTP does not exist for given email",
      });
    }

    if (otpResponse.expiresAt < new Date()) {
      await OTPModel.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }
    const verify = await bcrypt.compare(otp, otpResponse.otpHash);

    if (!verify) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const userResponse = await User.create({
      email: email,
      password: otpResponse.data.passwordHashed,
    });

    await OTPModel.deleteOne({ email: email });

    const welcomeMailHTML = getWelcomeEmailTemplate(email);

    try {
      await sendMail(email, "Signup Successful 🎉", welcomeMailHTML);
    } catch (error) {
      console.log("Failed to send welcome mail!!", error);
    }

    return res.status(200).json({
      success: true,
      message: "User signed up successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while verifying the otp",
      error: error,
    });
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { success, error, data } = resendOtpSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const { email } = data;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    const otpExists = await OTPModel.findOne({ email });

    if (!otpExists) {
      return res.status(404).json({
        success: false,
        message: "OTP expired, Please signup again",
      });
    }

    if (Date.now() - otpExists.updatedAt.getTime() < 2 * 60 * 1000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before requesting another OTP",
      });
    }

    const newOtp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const newOtpHash = await bcrypt.hash(newOtp, 10);

    otpExists.otpHash = newOtpHash;
    otpExists.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await otpExists.save();

    const otpHTML = getMailHTMLTemplate(newOtp);
    await sendMail(email, "OTP for signup", otpHTML);

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resending the otp",
    });
  }
};
