import { isAuthed } from '../lib/auth.js';

const ALLOWED_MODELS = new Set(['deepseek-v4-flash', 'deepseek-v4-pro']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAuthed(req)) return res.status(401).json({ error: '未登录' });

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return res.status(500).json({ error: '服务器未配置 DeepSeek API Key' });

  const model = ALLOWED_MODELS.has(req.body?.model) ? req.body.model : 'deepseek-v4-flash';
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  if (!messages.length || messages.length > 100) return res.status(400).json({ error: '消息格式无效' });

  try {
    const upstream = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ model, messages, stream: false })
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: data?.error?.message || `DeepSeek API 错误 (${upstream.status})` });
    }
    return res.status(200).json({ content: data?.choices?.[0]?.message?.content || '' });
  } catch (error) {
    return res.status(502).json({ error: `连接 DeepSeek 失败：${error.message}` });
  }
}
