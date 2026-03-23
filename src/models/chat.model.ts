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
        messages: [messageSchema],
    },
    { timestamps: true },
);

export const ChatModel = mongoose.model("Chat", chatSchema);
