import type { Request, Response } from "express";
import { processPdf } from "../services/pdf.service.js";
import fs from "fs";
import { PDFModel } from "../models/pdf.model.js";

export const uploadPdf = async (req: Request, res: Response) => {
    const filePath = req.file?.path;
    const filename = req.file?.originalname;
    if (!filePath || !filename) {
        return res.status(400).json({
            success: false,
            message: "No file uploaded",
        });
    }

    const userId = req.userId!;
    let doc;
    try {
        doc = await PDFModel.create({
            userId: userId,
            fileName: filename,
        });

        const fileId = doc._id.toString();

        const namespace = `${userId}_${fileId}`;

        await processPdf(filePath, namespace);

        await fs.promises.unlink(filePath);

        return res.status(200).json({
            success: true,
            message: "PDF processed successfully",
            fileId,
        });
    } catch (error) {
        if (filePath) {
            await fs.promises.unlink(filePath).catch(() => {});
        }
        if (doc?._id) {
            await PDFModel.findByIdAndDelete(doc?._id);
        }
        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing the pdf",
        });
    }
};
