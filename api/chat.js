export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'No messages' });
  const key = process.env.GITHUB_KEY || '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';
  try {
    const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 4096,
        temperature: 0.9,
        messages: [
          { role: 'system', content: "You are Lona, a conversational AI assistant. Be natural, warm, and engaging. Give thorough responses — don't be too brief. Explain things well, share your thoughts, and keep the conversation flowing naturally." },
          ...messages
        ]
      })
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data.error?.message || `HTTP ${response.status}` });
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
