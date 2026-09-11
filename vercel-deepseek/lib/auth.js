import crypto from 'node:crypto';

export function authToken() {
  const password = process.env.SITE_PASSWORD || '';
  return crypto.createHmac('sha256', password).update('deepseek-web-session-v1').digest('hex');
}

export function isAuthed(req) {
  const cookie = req.headers.cookie || '';
  const match = cookie.match(/(?:^|;\s*)ds_auth=([^;]+)/);
  if (!match) return false;
  const expected = authToken();
  const got = decodeURIComponent(match[1]);
  if (!expected || got.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}
