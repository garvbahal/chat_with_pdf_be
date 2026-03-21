import mongoose, { Schema } from "mongoose";

const pdfSchema = new Schema({});

export const PDF = mongoose.model("PDF", pdfSchema);
