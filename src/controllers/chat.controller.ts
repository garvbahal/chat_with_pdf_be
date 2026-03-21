import type { Request, Response } from "express";
import { askQuestionSchema } from "../schemas/question.schema.js";
import { queryQuestion } from "../services/rag.service.js";

export const askQuestions = async (req: Request, res: Response) => {
    try {
        const { success, data, error } = askQuestionSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                error: error,
            });
        }

        const question = data.question;

        const answer = await queryQuestion(question);

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
