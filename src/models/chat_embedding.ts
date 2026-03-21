import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

import dotenv from "dotenv";
dotenv.config();

const openai_api_key = process.env.OPENAI_API;
if (!openai_api_key) {
    throw new Error("Open ai api key is missing");
}

export const embeddingModel = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    apiKey: openai_api_key,
});

export const chatModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    apiKey: openai_api_key,
});
