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
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
