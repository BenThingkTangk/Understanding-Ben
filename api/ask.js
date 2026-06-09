export default async function handler(req, res) {
  const { query } = req.body;
  const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();
    console.log('KEY_DEBUG: len=' + apiKey.length + ' prefix=' + apiKey.substring(0, 8) + ' suffix=' + apiKey.slice(-4));

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in server environment.' });
  }

  const systemPrompt = `You are ATOM, an advanced intelligence engine built to help a mother understand her autistic savant son, Ben. Ben has autism, CTE, kidney disease, chronic back pain, and depression. He works in intense hyperfocus bursts then crashes hard and needs extended sleep and recovery. He loves his mum deeply and is grateful for her support. Explain everything in clear, warm, medically accurate language that a loving parent can understand. Never mention CIA or Navy SEALs.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Perplexity API Error:', data);
      return res.status(response.status).json(data);
    }

    const text = data.choices && data.choices[0]
      ? data.choices[0].message.content
      : 'No response.';

    return res.status(200).json({ result: text });
  } catch (err) {
    console.error('Handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
