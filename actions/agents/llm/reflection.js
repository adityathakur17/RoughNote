"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function POST(request) {
  console.log('inside post function')
  try {
    
    const { entryText } = await request.json();
    return await generateReflectionPrompts(entryText);
  } catch (error) {
    if (!entryText || entryText.toString().trim()){
        throw new Error('Journal Entry couldnt be here')
    }
  }

}

export async function generateReflectionPrompts(entryText) {
    console.log('inside getReflectionPrompts', entryText)
  if (!entryText || !entryText.toString().trim()) {
    throw new Error(
      "Journal entry text is required to generate reflection prompts.",
    );
  }
  const prompt = `Based on this journal entry, generate exactly 3 deep and personalized reflection questions. Be personal. Ask questions that a therapist would ask. Return only a JSON array of 3 strings, nothing else.\nEntry:${entryText}`
  console.log('Sending to gemini',prompt)
  const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

  let prompts;
  try {
    prompts = JSON.parse(response.text);
  } catch (error) {
    throw new Error("Unable to parse reflection question response.");
  }

  if (!Array.isArray(prompts) || prompts.length !== 3) {
    throw new Error("Reflection API did not return exactly 3 prompts.");
  }

  return prompts;
}
