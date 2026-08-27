// api/chat.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Groq API Key not configured in Vercel' });
    }

    // Tambahkan instruksi sistem khusus untuk Qwen agar tidak menampilkan "thinking process"
    // Kita sisipkan ini di awal messages array jika belum ada
    const enhancedMessages = [
      {
        role: "system",
        content: "You are ORIXTRON. Answer directly and concisely. DO NOT output your internal thinking process, chain of thought, or 'Here is a thinking process'. Only provide the final answer."
      },
      ...messages
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "qwen/qwen3.6-27b", 
        messages: enhancedMessages, // Gunakan pesan yang sudah ditambah instruksi
        temperature: 0.4,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error("Groq Error Detail:", data.error);
      return res.status(400).json({ error: data.error });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
