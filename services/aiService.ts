
export const getAIResponse = async (userInput: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Error from AI service:", response.status, errorData);
      const message = errorData?.error || "サーバーとの通信でエラーが発生しました。";
      return `申し訳ありません、エラーが発生しました: ${message}`;
    }

    const data = await response.json();
    return data.response;

  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "申し訳ありません、応答を取得中にネットワークエラーが発生しました。少し時間をおいてから、もう一度お試しください。";
  }
};
