import { authToken } from '../../lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const configured = process.env.SITE_PASSWORD || '';
  const supplied = String(req.body?.password || '');
  if (!configured || supplied !== configured) return res.status(401).json({ error: '密码错误' });
  const token = authToken();
  res.setHeader('Set-Cookie', `ds_auth=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`);
  return res.status(200).json({ ok: true });
}
