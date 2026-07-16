import OpenAI from "openai";
import { db } from "@/lib/prisma";

const openai = new OpenAI({apiKey:process.env.OPENAI_API_KEY})

export async function growthAnalysis(userId){
    const now = new Date()

    //Recent 30 days
    const recentEnd = now;
    const recentStart = new Date(now)
    recentStart.setDate(now.getDate()-30);

    //Previous 30 days
    const olderEnd = new Date(recentStart)
    const olderStart = new Date(recentStart)
    olderStart.setDate(recentStart.getDate()-30)

    console.log({olderStart,olderEnd, recentEnd, recentStart})

    const olderEntries = await db.entry.findMany({
        where:{
            userId,
            createdAt:{
                gte:olderStart,
                lt:olderEnd
            }
        },
        orderBy:{
            createdAt:"asc"
        }
    })

    const recentEntries = await db.entry.findMany({
        where:{
            userId,
            createdAt:{
                gte:recentStart,
                lt:recentEnd
            }
        },
        orderBy:{
            createdAt:"asc"
        }
    })

    console.log(recentEntries,"Recent entire")
    console.log(olderEntries,'OLDER ENRIE')

    const response = await openai.chat.completions.create({
        model:'gpt-4.1-nano',
        messages:[
            {
                role:'system',
                content:`
                    OLDER ENTRIES:
                    ${olderEntries}

                    RECENT ENTRIES:
                    ${recentEntries}

                    Compare these two periods and identify:
                    1. Emotional changes
                    2. Goal changes
                    3. New interests
                    4. Reduced concerns
                    5. Contradictions between earlier and later statements
                    6. Evidence of growth

                    RULES:
                    1. Do not sound robotic 
                    2. Talk how a therapist would talk to their pateint while giving analysis be professional but human
                    3. Use both paragraph style and bulleted points style.
                `
            }
        ]
    })
    // if (olderEntries.length<3 || recentEntries<3){
    //     return {
    //         message:'Not enough journal history yet to analyze growth.'
    //     }
    // }
    return response.choices[0].message.content

}