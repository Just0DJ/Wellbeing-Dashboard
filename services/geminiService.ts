
import { GoogleGenAI, Type } from "@google/genai";
import { WellbeingStats } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getWellbeingAdvice = async (stats: WellbeingStats) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these wellbeing stats and provide 3 short, actionable tips to improve digital health.
      Stats: 
      Total Screen Time: ${stats.totalScreenTime}
      Longest Session: ${stats.longestSession}
      Top App: ${stats.topApps[0].name} (${stats.topApps[0].time})
      Change vs Yesterday: ${stats.changeVsYesterday}%
      `,
      config: {
        systemInstruction: "You are a professional digital wellbeing coach. Be concise, encouraging, and provide very specific actionable advice. Format your response as a JSON array of strings.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          }
        }
      },
    });

    return JSON.parse(response.text) as string[];
  } catch (error) {
    console.error("Error fetching AI advice:", error);
    return [
      "Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
      "Set a 'gray-scale' mode on your most distracting apps to reduce their appeal.",
      "Go for a 5-minute tech-free walk to reset your focus."
    ];
  }
};
