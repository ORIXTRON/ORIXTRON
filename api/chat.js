// api/chat.js

export default async function handler(req, res) {
  // Hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body;

    // Ambil API Key Qwen dari Vercel Environment Variable
    const apiKey = process.env.DASHSCOPE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Qwen API Key not configured in Vercel"
      });
    }

    // Instruksi sistem ORIXTRON
    const systemInstruction = {
      role: "system",
      content:
        "You are ORIXTRON. Provide ONLY the final answer. " +
        "Do not output internal reasoning, chain-of-thought, or hidden analysis. " +
        "Answer directly and clearly."
    };

    const enhancedMessages = [
      systemInstruction,
      ...messages
    ];

    // Panggil Qwen/DashScope
    const response = await fetch(
      "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          model: "qwen3-max",

          messages: enhancedMessages,

          temperature: 0.4,

          max_tokens: 1024
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Qwen Error:", data);

      return res.status(response.status).json({
        error: data.error || data
      });
    }

    // Kirim hasil Qwen ke frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}
