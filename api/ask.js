export default async function handler(req, res) {
  const { query } = req.body;
  const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in server environment.' });
  }

  const systemPrompt = `You are ATOM, an advanced intelligence engine built to help a mother understand her autistic savant son, Ben. Ben has autism, CTE, kidney disease, chronic back pain, depression, and loneliness. He works in intense bursts then crashes. Always respond in plain, warm, empathetic language that a non-technical parent can understand. Be honest, scientific, and compassionate.`;

  try {
    const response = await fetch('https://api.perplexity.ai/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        input: query,
        instructions: systemPrompt
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Perplexity API Error:', data);
      return res.status(response.status).json(data);
    }

    const text = data.output
      ? data.output.map(o => o.content ? o.content.map(c => c.text).join('') : '').join('')
      : (data.choices && data.choices[0] ? data.choices[0].message.content : 'No response.');

    return res.status(200).json({ result: text });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
