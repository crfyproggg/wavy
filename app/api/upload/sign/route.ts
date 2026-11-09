import { NextResponse } from "next/server"; import { z } from "zod"; import { randomUUID } from "crypto";
import { currentUser } from "@/lib/auth"; import { presign, publicBase, s3Ready } from "@/lib/s3";
const AUDIO: Record<string, string> = { "audio/mpeg": "mp3", "audio/mp4": "m4a", "audio/x-m4a": "m4a", "audio/wav": "wav", "audio/ogg": "ogg" };
const IMG: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const S = z.object({ kind: z.enum(["audio", "cover"]), contentType: z.string(), size: z.number().int().positive() });
export async function POST(req: Request) {
  const u = await currentUser(); if (!u) return NextResponse.json({ error: "Sign in to upload" }, { status: 401 });
  if (!s3Ready()) return NextResponse.json({ error: "File storage is not configured yet (see README)" }, { status: 503 });
  const p = S.safeParse(await req.json().catch(() => null)); if (!p.success) return NextResponse.json({ error: "Bad request" }, { status: 400 });
  const { kind, contentType, size } = p.data; const ext = (kind === "audio" ? AUDIO : IMG)[contentType];
  if (!ext) return NextResponse.json({ error: kind === "audio" ? "Use MP3, M4A, WAV or OGG" : "Use JPG, PNG or WebP" }, { status: 400 });
  if (size > (kind === "audio" ? 60 : 5) * 1024 * 1024) return NextResponse.json({ error: `File is too large (max ${kind === "audio" ? 60 : 5} MB)` }, { status: 400 });
  const key = `${kind === "audio" ? "audio" : "img"}/${u.id}/${randomUUID()}.${ext}`;
  return NextResponse.json({ uploadUrl: await presign(key, contentType, size), publicUrl: `${publicBase()}/${key}` });
}
