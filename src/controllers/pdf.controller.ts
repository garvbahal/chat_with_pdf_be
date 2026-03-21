import type { Request, Response } from "express";
import { processPdf } from "../services/pdf.service.js";
import fs from "fs";

export const uploadPdf = async (req: Request, res: Response) => {
    try {
        const filePath = req.file?.path;

        if (!filePath) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        try {
            await processPdf(filePath);
        } catch (error) {
            if (filePath) {
                await fs.promises.unlink(filePath).catch(() => {});
            }
        }
        await fs.promises.unlink(filePath);

        return res.status(200).json({
            success: true,
            message: "PDF processed successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong while processing the pdf",
        });
    }
};
