import Link from "next/link"; import { currentUser } from "@/lib/auth";
export default async function TopNav() {
  const u = await currentUser();
  return (<header className="sticky top-0 z-40 flex h-12 items-center border-b border-line bg-ink/95 px-4 backdrop-blur">
    <Link href="/" className="mr-5 text-xl font-extrabold tracking-tight">wavy</Link>
    <nav className="hidden sm:flex">{[["Home", "/"], ["Search", "/search"], ["Library", "/library"], ["Upload", "/upload"]].map(([n, h]) => <Link key={h} href={h} className="px-3 text-sm font-semibold text-mute hover:text-white">{n}</Link>)}</nav>
    <div className="ml-auto text-sm">{u ? <Link href="/library" className="font-semibold">{u.displayName}</Link> : <Link href="/login" className="rounded bg-[#ECE9E4] px-3 py-1 font-semibold text-ink">Sign in</Link>}</div>
  </header>);
}
