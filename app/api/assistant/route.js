import { NextResponse } from "next/server";
import { askJournalAssistant } from "@/actions/agents/assistant";

export async function POST(request) {
  try {
    const { question, collectionId } = await request.json();

    if (!question) {
      return NextResponse.json({ error: "Missing question" }, { status: 400 });
    }

    const answer = await askJournalAssistant(question, collectionId);
    return NextResponse.json({ answer });
  } catch (error) {
  console.error(error);

  const message =
    error instanceof Error
      ? error.message
      : "Server error";

  const status =
    message.includes("Too Many Requests")
      ? 429
      : 500;

  return NextResponse.json(
    { error: message },
    { status }
  );
}
}
