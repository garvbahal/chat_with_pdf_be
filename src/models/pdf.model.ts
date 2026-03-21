import mongoose, { Schema } from "mongoose";

const pdfSchema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        fileName: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

export const PDFModel = mongoose.model("PDF", pdfSchema);
