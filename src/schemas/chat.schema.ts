import { z } from "zod";

export const askQuestionSchema = z.object({
    question: z.string().min(1, "Question can't be empty"),
    fileId: z.string().min(1, "Missing the fileId"),
});

export const getChatSchema = z.object({
    pdfId: z.string().min(1, "PdfId is required"),
});
