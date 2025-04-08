"use server";

import { unstable_cache } from "next/cache";

export async function getPixabayImage() {
  try {
    const res = fetch(
      `https://pixabay.com/api?q=${query}&key=${process.env.PIXABAY_API_KEY}&min_width=1280&min_height=720&image_type=illustration&catagory=feelings`
    );
    const data = await res.json();
    return data.hits[0]?.largeImageURL || null;
  } catch (error) {
    console.error("PIXABAY API Error:",error)
    return null;
  }
}

export const getDailyPrompt = unstable_cache(
  async () => {
    try {
      const response = await fetch("https://api.adviceslip.com/advice", {
        cache: "no-store",
      });
      const data = await response.json();
      return data.slip.advice;
    } catch (error) {
      return "What's on your mind today";
    }
  },
  ["daily-promt"],
  {
    revalidate: 86400,
    tags: "daily-prompt",
  }
);
