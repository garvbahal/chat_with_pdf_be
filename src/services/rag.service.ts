import { PineconeStore } from "@langchain/pinecone";
import { chatModel, embeddingModel } from "../models/chat_embedding.js";
import { pineconeIndex } from "../config/pinecone.js";

export async function queryQuestion(question: string) {
    const vectorStore = new PineconeStore(embeddingModel, {
        pineconeIndex,
        namespace: "temp-checking",
        maxConcurrency: 5,
    });

    const retriver = vectorStore.asRetriever({
        k: 3,
    });

    const docs = await retriver.invoke(question);

    const context = docs.map(
        (doc, i) =>
            `Chunk: ${i + 1} (Page ${doc.metadata.page}) : ${doc.pageContent}`,
    );

    const response = await chatModel.invoke(`
        You are a helpful assistant.

    Use ONLY the provided context to answer the question.
    If the answer is not in the context, say "I don't know".

    ${context}

    Question: ${question}
    Answer clearly and mention the page number.
        `);

    console.log("final ans: ", response.content);
}
