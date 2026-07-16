import OpenAI from "openai";
import { db } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateMonthlyReflection(userId, month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);
  const entries = await db.entry.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  if (entries.length === 0) {
    return {
      summary: "No journal entries found for this month.",
      entryCount: 0,
      themes: [],
    };
  }

  //Context for GPT
  const context = entries
    .map(
      (entry) => `Date: ${entry.createdAt.toISOString().split("T")[0]}
                  Mood: ${entry.mood}
                  Title: ${entry.title}
                  Content: ${entry.content.replace(/<[^>]*>/g, "")}  
        `,
    )
    .join("\n\n");

  //Generate Reflection
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-nano",
    messages: [
      {
        role: "system",
        content: `
                You are an AI journaling coach.

                Generate a thoughtful monthly reflection using ONLY the provided journal entries.

                Include:
                1. Overall emotional trend
                2. Main recurring themes
                3. Notable challenges
                4. Positive developments or wins
                5. A short encouraging reflection

                Do not invent facts that are not present in the entries.
                `,
      },
      {
        role:"user",
        content:`Month:${year}-${month}
        Journal Entries: ${context}
        `
      }
    ],
  });

  return {
    summary: response.choices[0].message.content,
    entryCount: entries.length,
    period:`${year}-${String(month).padStart(2, "0")}`
  }
}
