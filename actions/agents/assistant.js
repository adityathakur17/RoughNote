"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { answerQuestion } from "./rag/searchEntries";

export async function askJournalAssistant(question, collectionId) {
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  const req = await request();

  const decision = await aj.protect(req, {
    userId: clerkUserId,
    requested: 1,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
     throw new Error("Too many requests, Please try again later")
    }
    throw new Error("Request Blocked");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await answerQuestion(question, collectionId, user.id);
}
