
// api/chat.js
// ORIXTRON — Gemini AI Backend

export default async function handler(req, res) {

  // Hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body || {};

    // Validasi input
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Invalid messages"
      });
    }

    // Ambil API Key dari Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "Gemini API key not configured"
      });
    }

    // Model Gemini
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    // Instruksi sistem ORIXTRON
    const systemInstruction = {
      parts: [{
        text:
          "You are ORIXTRON, an advanced AI financial and technology analyst. " +
          "Provide only the final answer. " +
          "Never reveal internal reasoning or hidden chain-of-thought. " +
          "Be accurate, analytical, objective, and clear. " +
          "Never fabricate financial data or market information."
      }]
    };

    // Konversi format OpenAI ke format Gemini
    const contents = messages
      .filter(msg =>
        msg &&
        ["user", "assistant"].includes(msg.role) &&
        typeof msg.content === "string"
      )
      .map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{
          text: msg.content
        }]
      }));

    if (contents.length === 0) {
      return res.status(400).json({
        error: "No valid messages"
      });
    }

    // Request Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction,
          contents,
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048
          }
        })
      }
    );

    const data = await response.json();

    // Tangani error Gemini
    if (!response.ok) {
      console.error("Gemini API Error:", response.status);

      return res.status(502).json({
        error: "Gemini API request failed",
        status: response.status
      });
    }

    // Ambil jawaban AI
    const answer = data.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("");

    if (!answer) {
      return res.status(502).json({
        error: "Gemini returned an empty response"
      });
    }

    // Format respons kompatibel dengan frontend OpenAI
    return res.status(200).json({
      choices: [{
        message: {
          role: "assistant",
          content: answer
        }
      }]
    });

  } catch (error) {

    console.error("ORIXTRON Server Error:", error.message);

    return res.status(500).json({
      error: "Internal Server Error"
    });
  }
}
