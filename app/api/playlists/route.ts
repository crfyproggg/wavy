import { NextResponse } from "next/server"; import { z } from "zod"; import { db } from "@/lib/db"; import { currentUser } from "@/lib/auth";
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "Sign in first" }, { status: 401 });
  const p = z.object({ name: z.string().trim().min(1).max(80) }).safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "Enter a playlist name" }, { status: 400 });
  return NextResponse.json(await db.playlist.create({ data: { name: p.data.name, ownerId: u.id } }));
}
