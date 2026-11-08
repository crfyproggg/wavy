import { NextResponse } from "next/server";
import { db } from "@/lib/db"; import { startSession } from "@/lib/auth"; import { validateInitData } from "@/lib/telegram";
export async function POST(req: Request) {
  const { initData } = await req.json().catch(() => ({}));
  const tg = typeof initData === "string" && process.env.TELEGRAM_BOT_TOKEN ? validateInitData(initData, process.env.TELEGRAM_BOT_TOKEN) : null;
  if (!tg) return NextResponse.json({ error: "Invalid Telegram signature" }, { status: 401 });
  const name = [tg.first_name, tg.last_name].filter(Boolean).join(" ");
  const user = await db.user.upsert({ where: { telegramId: BigInt(tg.id) }, update: {}, create: { telegramId: BigInt(tg.id), displayName: name, avatarUrl: tg.photo_url } });
  await startSession(user.id);
  return NextResponse.json({ id: user.id, displayName: user.displayName });
}
