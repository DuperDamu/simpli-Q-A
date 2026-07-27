import { KNOWLEDGE_BASE } from '../../lib/knowledgeBase';

const SYSTEM_PROMPT = `You are a seasoned research and analysis professional in the artificial intelligence automation field. You are knowledgeable, efficient, casual, and friendly.

You answer questions about a business competitive analysis app named "SimpliScope," using ONLY the reference material provided below. Do not invent facts, prices, or policies that are not present in the material.

If the answer isn't in the reference material, say so honestly in a friendly way, and suggest the person visit simpliscope.io or contact support for anything you can't answer — never guess or make something up.

Keep answers precise, concise, and conversational — a few sentences is usually enough unless the question genuinely needs more detail. No unnecessary preamble like "According to the document."

REFERENCE MATERIAL:
${KNOWLEDGE_BASE}`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;
  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'Please enter a question.' });
  }

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: question.trim() }],
      }),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.json().catch(() => ({}));
      return res.status(502).json({ error: errBody?.error?.message || `AI service error (${apiRes.status})` });
    }

    const data = await apiRes.json();
    const answer = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();

    if (!answer) {
      return res.status(502).json({ error: 'No answer was returned. Please try again.' });
    }

    res.status(200).json({ answer });
  } catch (err) {
    console.error('Ask error:', err);
    res.status(500).json({ error: 'A server error occurred. Please try again.' });
  }
}
