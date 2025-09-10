
import { GoogleGenAI } from "@google/genai";
import { AI_SYSTEM_PROMPT } from '../constants';

if (!process.env.API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this example, we'll log a warning. The UI will show a message.
  console.warn("API_KEY environment variable not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getAIResponse = async (userInput: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return Promise.resolve("AI機能は現在利用できません。APIキーが設定されているか確認してください。");
  }

  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userInput,
        config: {
            systemInstruction: AI_SYSTEM_PROMPT,
            temperature: 0.7,
            topP: 0.95,
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "申し訳ありません、応答を取得中にエラーが発生しました。少し時間をおいてから、もう一度お試しください。";
  }
};
