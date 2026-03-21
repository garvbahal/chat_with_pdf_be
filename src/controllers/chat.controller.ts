import type { Request, Response } from "express";
import { askQuestionSchema } from "../schemas/question.schema.js";

export const askQuestions = (req: Request, res: Response) => {
    try {
        const { success, data, error } = askQuestionSchema.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                success: false,
                error: error,
            });
        }

        const question = data.question;

        
    } catch (error) {}
};
