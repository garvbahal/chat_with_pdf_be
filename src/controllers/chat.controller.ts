import type { Request, Response } from "express";
import { askQuestionSchema, getChatSchema } from "../schemas/chat.schema.js";
import { queryQuestion } from "../services/rag.service.js";
import { PDFModel } from "../models/pdf.model.js";
import { ChatModel } from "../models/chat.model.js";

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

        await ChatModel.updateOne(
            { userId, pdfId: fileId, isTitleGenerated: false },
            {
                $set: {
                    isTitleGenerated: true,
                    title: question.slice(0, 40),
                },
            },
        );

        await ChatModel.updateOne(
            { userId, pdfId: fileId },
            {
                $push: {
                    messages: [
                        { role: "user", content: question },
                        { role: "assistant", content: answer },
                    ],
                },
                $set: {
                    lastMessage: question,
                },
            },
        );

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

export const getAllChatHistory = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please log in first",
            });
        }

        const allChats = await ChatModel.find({ userId: userId })
            .select("lastMessage pdfId title updatedAt")
            .populate("pdfId", "fileName")
            .sort({ updatedAt: -1 })
            .exec();

        return res.status(200).json({
            success: true,
            allChats,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the all chat history",
        });
    }
};

export const getChatMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please log in first",
            });
        }

        const { success, error, data } = getChatSchema.safeParse(req.params);

        if (!success) {
            return res.status(400).json({
                success: false,
                message: "Zod validation error",
                error,
            });
        }

        const { pdfId } = data;

        const chatResponse = await ChatModel.findOne({
            userId: userId,
            pdfId: pdfId,
        }).select("title messages");

        if (!chatResponse) {
            return res.status(404).json({
                success: false,
                message: "Chat not found",
            });
        }

        // chatResponse.messages.sort(
        //     (a, b) =>
        //         new Date(a.createdAt).getTime() -
        //         new Date(b.createdAt).getTime(),
        // );

        return res.status(200).json({
            success: true,
            message: "Chat Messages fetched successfully",
            chatResponse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching chat messages",
        });
    }
};
