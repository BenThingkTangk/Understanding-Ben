export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query } = req.body;
  const apiKey = (process.env.PERPLEXITY_API_KEY || '').trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in server environment.' });
  }

  if (!query) {
    return res.status(400).json({ error: 'Query is required.' });
  }

  const systemPrompt = `You are ATOM, an advanced intelligence engine built to help a mother understand her autistic savant son, Ben. Ben has autism, CTE, kidney strain, and chronic back pain. He works in hyperfocused bursts then needs days to recover. He is deeply grateful for his mother and Kevin. Answer questions clearly, with empathy and medical accuracy. No jargon. Plain language. Focused on Ben's specific conditions.`;

  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Perplexity API Error:', JSON.stringify(data));
      return res.status(response.status).json(data);
    }

    const text = data.choices && data.choices[0]
      ? data.choices[0].message.content
      : 'No response.';

    return res.status(200).json({ result: text });
  } catch (err) {
    console.error('Handler error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
