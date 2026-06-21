import OpenAI from "openai";
import { db } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function createEntryEmbedding(entry) {
    const textToEmbed = `
Title: ${entry.title}

Mood: ${entry.mood}
Mood Score: ${entry.moodScore}

Date: ${entry.createdAt.toISOString()}

Content:
${entry.content}
`;

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: textToEmbed,
  });

  const embedding = embeddingResponse.data[0].embedding;

  await db.$executeRaw`
    INSERT INTO journal_embeddings (
      entry_id,
      collection_id,
      user_id,
      embedding
    )
    VALUES (
      ${entry.id},
      ${entry.collectionId},
      ${entry.userId},
      ${JSON.stringify(embedding)}::vector
    )
  `;
}