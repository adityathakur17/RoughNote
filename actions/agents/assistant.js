"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { answerQuestion } from "./agents/rag/searchEntries";

export async function askJournalAssistant(
  question,
  collectionId
) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await answerQuestion(
    question,
    collectionId,
    user.id
  );
}