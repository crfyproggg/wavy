import crypto from "crypto";
export type TgUser = { id: number; first_name: string; last_name?: string; photo_url?: string };
/** Verifies Telegram WebApp initData per https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app */
export function validateInitData(initData: string, botToken: string, maxAgeSec = 86400): TgUser | null {
  const p = new URLSearchParams(initData); const hash = p.get("hash"); if (!hash) return null; p.delete("hash");
  const check = [...p.entries()].map(([k, v]) => `${k}=${v}`).sort().join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(botToken).digest();
  const calc = Buffer.from(crypto.createHmac("sha256", secret).update(check).digest("hex")); const got = Buffer.from(hash);
  if (calc.length !== got.length || !crypto.timingSafeEqual(calc, got)) return null;
  if (!(Date.now() / 1000 - Number(p.get("auth_date")) < maxSec(maxAgeSec))) return null;
  try { return JSON.parse(p.get("user") || "null"); } catch { return null; }
}
const maxSec = (n: number) => n;
