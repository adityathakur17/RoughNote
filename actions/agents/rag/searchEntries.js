import OpenAI from "openai";
import { db } from "@/lib/prisma";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function searchEntries(query, collectionId, userId) {
  //Generate Embeddings for user query
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });

  const queryEmbedding = embeddingResponse.data[0].embedding;

  const results = await db.$queryRaw`
    SELECT
        e.id,
        e.title,
        e.content,
        e.mood,
        e."createdAt"
    FROM journal_embeddings je
    JOIN "Entry" e
        ON e.id = je.entry_id
    WHERE je.collection_id = ${collectionId}
        AND je.user_id = ${userId}
    ORDER BY je.embedding <=> ${JSON.stringify(queryEmbedding)}::vector
    LIMIT 5
  `;
  return results;
}

export async function answerQuestion(question, collectionId, userId) {
  const entries = await searchEntries(
    question,
    collectionId,
    userId,
  );
  console.log("Retrieved entries:", entries);

  if(!entries.length){
    return "I couldnt find any relevant journal entries"
  }

  const context = entries
    .map(
      (entry) => `
    Date:${entry.createdAt}
    Mood:${entry.mood}
    Title:${entry.title}
    Content: ${entry.content.replace(/<[^>]*>/g, "")}
  `,
    )
    .join("\n\n");

  console.log("Context:", context);
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "system",
        content: `
You are an AI assistant for a personal journal.

Use only the journal entries provided as context.

If the answer cannot be determined from the provided entries, say:
"I couldn't find that information in this collection."

When relevant, mention:
- dates
- moods
- titles

and quote short excerpts from entries.
`,
      },
      {
        role:"user",
        content:`
        Question:${question}
        Journal Entries:${context}
        `
      }
    ],
  });
  return response.choices[0].message.content
}
