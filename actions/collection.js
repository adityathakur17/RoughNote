"use server";

import { auth } from "@clerk/nextjs/server";
import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCollection(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    //Arcjet rate limiting
    const req = await request();

    const decision = await aj.protect(req, {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;

        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset,
          },
        });

        throw new Error("Too many requests. Please try again later.");
      }
      throw new Error("Request Blocked.");
    }
    //Arcjet rate limiting

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const collection = await db.collection.create({
      data: {
        name: data.name,
        description: data.description,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return collection;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getCollections() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const collections = await db.collection.findMany({
    where: {
      userId: user.id, //why did we do this what does it mean why didnt we use clerkId is the same as clerkId?
    },
    orderBy: { createdAt: "desc" },
  });

  return collections;
}

export async function getCollection(collectionId) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) throw new Error("User not found");

  const collection = await db.collection.findFirst({
    where: {
      userId: user.id,
      id: collectionId,
    },
  });

  return collection;
}
