import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { db } from "./db";
const key = () => new TextEncoder().encode(process.env.JWT_SECRET!);
export async function startSession(userId: string) {
  const t = await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("30d").sign(key());
  cookies().set("wavy", t, { httpOnly: true, sameSite: "none", secure: true, path: "/", maxAge: 2592000 }); // none: needed inside Telegram WebView
}
export async function currentUser() {
  const t = cookies().get("wavy")?.value; if (!t) return null;
  try { const { payload } = await jwtVerify(t, key()); return db.user.findUnique({ where: { id: payload.sub as string } }); } catch { return null; }
}
