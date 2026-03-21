import type { Request, Response } from "express";
import { askQuestionSchema } from "../schemas/question.schema.js";
import { queryQuestion } from "../services/rag.service.js";
import { PDFModel } from "../models/pdf.model.js";

export const askQuestions = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = askQuestionSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                error: error,
            });
        }

        const { question, fileId } = data;

        const userId = req.userId!;

        const pdf = await PDFModel.findOne({
            _id: fileId,
            userId,
        });

        if (!pdf) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access to this file",
            });
        }

        const namespace = `${userId}_${fileId}`;

        const answer = await queryQuestion(question, namespace);

        return res.status(200).json({
            success: true,
            answer,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while asking the question",
            error: error,
        });
    }
};
