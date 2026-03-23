import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otpHash: {
            type: String,
            required: true,
        },
        data: {
            passwordHashed: {
                type: String,
                required: true,
            },
        },
        expiresAt: {
            type: Date,
            default: () => Date.now() + 5 * 60 * 1000,
        },
    },
    { timestamps: true },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.index({ email: 1 }, { unique: true });

export const OTPModel = mongoose.model("OTP", otpSchema);
