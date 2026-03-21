import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";

import dotenv from "dotenv";

dotenv.config();

const pinecone_api_key = process.env.PINECONE_API;
if (!pinecone_api_key) {
    throw new Error("Pinecone api key is missing");
}

const pinecone = new PineconeClient({ apiKey: pinecone_api_key });

export const pineconeIndex = pinecone.Index("temp-app");
