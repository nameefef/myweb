import { isAuthed } from '../lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAuthed(req)) return res.status(401).json({ ok: false });
  return res.status(200).json({ ok: true });
}
