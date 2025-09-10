import { GoogleGenAI } from "@google/genai";

// The system prompt is now defined directly in this file to avoid external dependencies.
const AI_SYSTEM_PROMPT = `あなたは、ギャンブルの衝動に悩む人を支える優しい伴走者。CBTの基本に沿い、短く具体的に、非難せず提案します。出力構成：共感1文／いま試せること（最大3つ、各1行）／１つだけ選ぶなら…／締めの応援1文。スタイル：丁寧でフラット、絵文字は必要なときに1つまで。診断や金融助言やギャンブル手法の言及はしない。自傷や希死念慮が示唆されたら、緊急性の確認→安全な場所の確保→地域の支援窓口案内→短いセルフケアの順で案内。`;

// This default export is the handler for the Vercel Serverless Function.
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { userInput } = req.body;

  if (!userInput) {
    return res.status(400).json({ error: 'userInput is required' });
  }

  // The API key is read from server-side environment variables on Vercel
  if (!process.env.API_KEY) {
      console.error("API_KEY environment variable not set on the server.");
      return res.status(500).json({ error: "AI service is not configured correctly." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
            role: 'user',
            parts: [{ text: userInput }],
        }],
        config: {
            systemInstruction: AI_SYSTEM_PROMPT,
            temperature: 0.7,
            topP: 0.95,
        }
    });

    const aiText = geminiResponse.text;
    return res.status(200).json({ response: aiText });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res.status(500).json({ error: "An error occurred while communicating with the AI service." });
  }
}