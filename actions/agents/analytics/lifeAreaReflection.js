import OpenAI from "openai";
import { db } from "@/lib/prisma";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function lifeAreaReflection(userId, month, year) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const entries = await db.entry.findMany({
    where: {
      userId,
      createdAt: {
        gte: startDate, //?
        lt: endDate, //?
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });
  if (entries.length === 0) {
    return {};
  }
 const context = entries
  .map(
    (entry) => `
Date: ${entry.createdAt.toISOString().split("T")[0]}
Title: ${entry.title}
Mood: ${entry.mood}
Content: ${entry.content.replace(/<[^>]*>/g, "")}
`
  )
  .join("\n\n");

const response = await openai.chat.completions.create({
  model: "gpt-4.1-nano",
  response_format: { type: "json_object" },
  messages: [
    {
      role: "system",
      content: `
Analyze all journal entries.

For EACH entry, determine the PRIMARY life area category.

Categories:
- Career
- Relationships
- Health
- Learning
- Creativity
- Other

Return ONLY valid JSON in this exact format:

{
  "Career": 0,
  "Relationships": 0,
  "Health": 0,
  "Learning": 0,
  "Creativity": 0,
  "Other": 0
}


The numbers should represent how many entries belong to each category.
The counts must add up to the total number of entries.
`,
    },
    {
      role: "user",
      content: context,
    },
  ],
});

const counts = JSON.parse(response.choices[0].message.content)

const total = entries.length;

const result = Object.fromEntries(
    Object.entries(counts).map(([key,value])=>[
        key,
        {
            count:value,
            percentage:Math.round((value/total)*100)
        },
    ])
)
return result
}
