// api/chat.js
export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;
    
    // Ambil API Key dari Environment Variable Vercel
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Groq API Key not configured in Vercel' });
    }

    // Panggil API Groq dari Server-side (Aman)
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.4,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error });
    }

    // Kirim balasan AI kembali ke frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

