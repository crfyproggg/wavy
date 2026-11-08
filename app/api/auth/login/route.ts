import { NextResponse } from "next/server"; import bcrypt from "bcryptjs"; import { z } from "zod";
import { db } from "@/lib/db"; import { startSession } from "@/lib/auth";
const S = z.object({ email: z.string().email(), password: z.string().min(8), displayName: z.string().min(1).optional() });
/** One endpoint: registers when displayName is given, otherwise logs in. */
export async function POST(req: Request) {
  const p = S.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Enter a valid email and a password of 8+ characters" }, { status: 400 });
  const { email, password, displayName } = p.data;
  if (displayName) {
    if (await db.user.findUnique({ where: { email } })) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    const u = await db.user.create({ data: { email, displayName, passwordHash: await bcrypt.hash(password, 12) } });
    await startSession(u.id); return NextResponse.json({ id: u.id });
  }
  const u = await db.user.findUnique({ where: { email } });
  if (!u?.passwordHash || !(await bcrypt.compare(password, u.passwordHash))) return NextResponse.json({ error: "Wrong email or password" }, { status: 401 });
  await startSession(u.id); return NextResponse.json({ id: u.id });
}
