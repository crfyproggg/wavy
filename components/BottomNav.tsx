"use client";
import Link from "next/link"; import { usePathname } from "next/navigation";
export default function BottomNav() {
  const p = usePathname();
  return (<nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-ink pb-[env(safe-area-inset-bottom)] sm:hidden">
    {[["Home", "/"], ["Search", "/search"], ["Library", "/library"], ["Upload", "/upload"]].map(([n, h]) => <Link key={h} href={h} className={`flex-1 py-4 text-center text-sm font-semibold ${p === h ? "text-white" : "text-mute"}`}>{n}</Link>)}</nav>);
}
