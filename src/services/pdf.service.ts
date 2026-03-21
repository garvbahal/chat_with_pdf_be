import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import dotenv from "dotenv";
import { embeddingModel } from "../models/chat_embedding.js";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "../config/pinecone.js";
dotenv.config();

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
});

export async function processPdf(filePath: string) {
    const loader = new PDFLoader(filePath);

    const docs = await loader.load();

    const cleanedDocs = docs.map(
        (doc) =>
            new Document({
                pageContent: doc.pageContent,
                metadata: {
                    source: filePath,
                    page: doc.metadata?.loc?.pageNumber ?? 1,
                },
            }),
    );

    const splittedDocs = await splitter.splitDocuments(cleanedDocs);

    const vectorStore = new PineconeStore(embeddingModel, {
        pineconeIndex,
        namespace: "temp-checking",
        maxConcurrency: 5,
    });

    await vectorStore.addDocuments(splittedDocs);

    console.log(`Processed ${splittedDocs.length} Chunks`);
}
