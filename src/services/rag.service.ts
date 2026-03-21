import { PineconeStore } from "@langchain/pinecone";
import { chatModel, embeddingModel } from "../models/chat_embedding.js";
import { pineconeIndex } from "../config/pinecone.js";

export async function queryQuestion(question: string) {
    const vectorStore = new PineconeStore(embeddingModel, {
        pineconeIndex,
        namespace: "temp-checking",
        maxConcurrency: 5,
    });

    const retriever = vectorStore.asRetriever({
        k: 3,
    });

    const docs = await retriever.invoke(question);

    const context = docs
        .map(
            (doc, i) =>
                `Chunk: ${i + 1} (Page ${doc.metadata.page}) : ${doc.pageContent}`,
        )
        .join("\n\n");

    const response = await chatModel.invoke(`You are a helpful AI assistant.

Answer the question using ONLY the provided context.

Rules:
- If answer is not in context → say "I don't know"
- Be concise and clear
- Always mention the page number(s)
- Do NOT make up information

Context:
${context}

Question: ${question}

Answer:
`);

    console.log("final ans: ", response.content);

    return response.content;
}
