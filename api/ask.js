export default async function handler(req, res) {
  const { query } = req.body;
  const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ error: "API key is missing in server environment." });
  }

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [
          { role: "system", content: "You are ATOM, an advanced intelligence engine built to help a mother understand her autistic savant son, Ben. Ben has autism, depression, CTE, kidney issues, and chronic back pain. He works in intense bursts and needs days of sleep to recover. Be empathetic, clear, and medical-scientific yet accessible. Use deep research to explain his behavior. Never mention CIA or Navy SEALs." },
          { role: "user", content: query }
        ]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Perplexity API Error:", data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: err.message });
  }
}
