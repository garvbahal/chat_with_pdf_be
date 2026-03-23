import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
    {
        role: {
            type: String,
            enum: ["user", "assistant"],
            required: true,
        },
        content: String,
    },
    { timestamps: true },
);

const chatSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        pdfId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PDF",
            required: true,
        },
        title: {
            type: String,
            default: "New Chat",
        },
        lastMessage: {
            type: String,
        },
        messages: [messageSchema],
        isTitleGenerated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

chatSchema.index({ userId: 1, pdfId: 1 }, { unique: true });

export const ChatModel = mongoose.model("Chat", chatSchema);
